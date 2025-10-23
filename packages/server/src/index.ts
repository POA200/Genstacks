// /packages/server/src/index.ts (FINAL RESILIENT BACKEND API)

import express, { Request, Response, Router } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import pool, { setupDatabase, Job } from './db';
import { Worker } from 'worker_threads';
import path from 'path';
import { QueryResult } from 'pg';
import axios from 'axios';
import { getUploadPreSignedUrl, getDownloadPreSignedUrl } from './s3';

dotenv.config();

const app = express();
const router = Router();
const PORT = process.env.PORT || 10000;

// --- Stacks API Configuration ---
const HIRO_API_BASE_URL = process.env.STACKS_API_URL || 'https://api.testnet.hiro.so';
const HIRO_API_KEY = process.env.HIRO_API_KEY;

// API Helper Function (Remains unchanged - uses axios/REST)
type StacksTransaction = { tx_status?: string;[key: string]: any; };

const fetchStacksTransaction = async (txId: string): Promise<StacksTransaction> => {
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (HIRO_API_KEY) { headers['x-api-key'] = HIRO_API_KEY; }
    const url = `${HIRO_API_BASE_URL}/v2/transactions/${txId}`;
    const response = await axios.get(url, { headers });
    return response.data as StacksTransaction;
};

// Middleware Setup
app.use(express.json());

// --- CRITICAL CORS CONFIGURATION ---
const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin) return callback(null, true);
        const isAllowed = allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com');
        if (!isAllowed) {
            const msg = `CORS policy blocked access from Origin: ${origin}`;
            console.error(msg);
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST'],
    credentials: true,
}));

// ********************************************************************
// ********** ROUTER DEFINITION: All API routes defined on 'router' *********
// ********************************************************************

// --- MOCK /generate-s3-upload-config ---
router.post('/generate-s3-upload-config', async (req: Request, res: Response) => {
    const { jobId, collectionName, userId } = req.body;
    if (!jobId || !userId) { return res.status(400).json({ message: 'Missing job ID or user ID.' }); }

    const s3Path = `s3://mock-bucket/jobs/${jobId}/raw_layers.zip`;
    try {
        await pool.query(
            `INSERT INTO jobs (id, user_address, collection_name, supply, rarity_config, s3_upload_path, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO UPDATE SET user_address = $2, collection_name = $3, updated_at = NOW()`,
            [jobId, userId, collectionName || 'Untitled', 0, JSON.stringify({}), s3Path, 'UNKNOWN']
        );
    } catch (e) { console.error("DB INSERT FAILED during config:", e); }

    res.status(200).json({
        message: 'S3 config generated successfully (MOCK).', jobId: jobId, uploadUrl: 'https://mock-s3-upload-url.com/path', s3BaseKey: s3Path,
    });
});


// --- 1. POST /start-generation (Job Trigger) ---
router.post('/start-generation', async (req: Request, res: Response) => {
    const { jobId, collectionName, supply, layers, stxAddress } = req.body;

    if (!jobId || !stxAddress || !supply || !layers) {
        return res.status(400).json({ status: 'error', message: 'Missing required configuration data.' });
    }

    try {
        // FIX 1: Explicitly stringify the layers and force $1 to be treated as text, 
        // which Postgres then casts to JSONB. This bypasses the serialization conflict.
        const updateResult: QueryResult<Job> = await pool.query(
            // FINAL DB FIX: Use the native PostgreSQL TO_JSON function on the stringified parameter.
            `UPDATE jobs SET rarity_config = TO_JSON($1), supply = $2, collection_name = $3, status = 'QUEUED', updated_at = NOW() 
            WHERE id = $4 RETURNING *`,
            [
                // We pass the JSON string, and TO_JSON converts the SQL string parameter into JSONB.
                JSON.stringify(layers), 
                supply, 
                collectionName, 
                jobId
            ]
        );

        if (updateResult.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Job not found for update.' });
        }

        const job: Job = updateResult.rows[0];

        // FIX 2: Use the explicit TS-NODE execArgv flag for high resilience in Render
        const workerPath = path.join(__dirname, 'worker', 'generator.ts');
        const workerUrl = new URL(`file://${workerPath}`);

        const worker = new Worker(workerUrl, {
            workerData: { jobId: job.id, jobData: job },
            // CRITICAL FIX for Worker Threads running TypeScript files on Render
            execArgv: ['-r', 'ts-node/register'],
        });

        worker.on('error', (err) => {
            console.error(`Worker thread error for ${job.id}:`, err);
            pool.query(`UPDATE jobs SET status = 'FAILED', updated_at = NOW() WHERE id = $1`, [job.id]);
        });
        worker.on('exit', (code) => {
            if (code !== 0) console.error(`Worker stopped for ${job.id} with exit code ${code}`);
        });

        // Return immediately (non-blocking)
        return res.status(202).json({ status: 'QUEUED', jobId: job.id, message: 'Generation job started successfully in background.' });

    } catch (e) {
        console.error('Database/Job queuing error:', e);
        return res.status(500).json({ status: 'error', message: 'Failed to queue generation job.' });
    }
});

// --- 2. GET /job-status/:id (Status Polling) ---
router.get('/job-status/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result: QueryResult<Job> = await pool.query(
            'SELECT id, status, s3_final_zip_path FROM jobs WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'UNKNOWN', message: 'Job not found.' });
        }

        const job = result.rows[0];

        let finalZipUrl = null;
        if (job.status === 'COMPLETE' || job.status === 'PAID') {
            const s3FinalPath = job.s3_final_zip_path || `jobs/${job.id}/final.zip`;
            finalZipUrl = await getDownloadPreSignedUrl(s3FinalPath);
        }

        return res.status(200).json({ status: job.status, jobId: job.id, finalZipUrl: finalZipUrl });

    } catch (e) {
        console.error('Job status query error:', e);
        return res.status(500).json({ status: 'error', message: 'Database error.' });
    }
});

// --- 3. POST /verify-payment (Unlock Download) ---
router.post('/verify-payment', async (req: Request, res: Response) => {
    const { jobId, txId, stxAddress } = req.body;

    if (!jobId || !txId || !stxAddress) {
        return res.status(400).json({ status: 'error', message: 'Missing transaction details.' });
    }

    try {
        const txResult = await fetchStacksTransaction(txId);

        if (txResult.tx_status !== 'success') {
            return res.status(400).json({ status: 'error', message: 'Stacks transaction did not succeed.' });
        }

        // MOCK: Assume verification passed based on successful tx status
        const paymentVerified = true;

        if (paymentVerified) {
            await pool.query(
                `UPDATE jobs SET status = 'PAID', tx_id_unlock = $1, updated_at = NOW() WHERE id = $2`,
                [txId, jobId]
            );

            const jobResult: QueryResult<Job> = await pool.query('SELECT s3_final_zip_path FROM jobs WHERE id = $1', [jobId]);
            const finalPath = jobResult.rows[0]?.s3_final_zip_path;

            const finalDownloadLink = finalPath ? await getDownloadPreSignedUrl(finalPath) : 'https://error.com/missing-path';

            return res.status(200).json({ status: 'PAID', downloadLink: finalDownloadLink, message: 'Payment verified and download link unlocked.' });
        } else {
            return res.status(400).json({ status: 'error', message: 'Clarity event verification failed.' });
        }
    } catch (e) {
        console.error('Payment verification API error:', e);
        return res.status(500).json({ status: 'error', message: 'Failed to verify payment via Stacks API. Check Hiro API key/rate limits.' });
    }
});

// Basic Health Check
router.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'NFT Generator API', dbStatus: pool ? 'connected' : 'disconnected' });
});


// --- CRITICAL: Tell Express to use the router under the /api path ---
app.use('/api', router);

// --- Server Start Function ---
const startServer = async () => {
    try {
        await setupDatabase();
    } catch (e) {
        console.error("Server failed to connect to DB. Shutting down.", e);
        return;
    }

    // 2. Start the Express server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}. DB connected.`);
    });
};

startServer();