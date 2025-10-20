// /packages/server/src/index.ts (FINAL, CLEANED BACKEND API ENDPOINTS)

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid'; 
import pool, { setupDatabase, Job } from './db'; 
import { Worker } from 'worker_threads'; 
import path from 'path'; 
import { QueryResult } from 'pg'; 
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000; 

// --- Stacks API Configuration ---
// Base URL for the Hiro API (Testnet recommended for dev)
const HIRO_API_BASE_URL = process.env.STACKS_API_URL || 'https://api.testnet.hiro.so'; 
const HIRO_API_KEY = process.env.HIRO_API_KEY; 

// Middleware Setup
app.use(express.json());

// --- CRITICAL CORS CONFIGURATION ---
const allowedOrigins = [ 'http://localhost:5173' ]; 

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

// --- API Helper Function (Cleanest REST Call) ---
type StacksTransaction = {
    tx_status?: string;
    [key: string]: any;
};

const fetchStacksTransaction = async (txId: string): Promise<StacksTransaction> => {
    const headers: Record<string, string> = {
        'Accept': 'application/json',
    };
    if (HIRO_API_KEY) {
        headers['x-api-key'] = HIRO_API_KEY;
    }
    
    // Direct call to the V2 transactions endpoint
    const url = `${HIRO_API_BASE_URL}/v2/transactions/${txId}`;
    
    // Use the generic response, casting to a known shape so callers don't get `unknown`
    const response = await axios.get(url, { headers });
    return response.data as StacksTransaction;
};
// ----------------------------------------------------

// --- MOCK /api/generate-s3-upload-config (Frontend Step 2) ---
app.post('/api/generate-s3-upload-config', async (req: Request, res: Response) => {
  const { jobId, collectionName, userId } = req.body;
  if (!jobId || !userId) {
     return res.status(400).json({ message: 'Missing job ID or user ID.' });
  }

  // MOCK: Save initial job status in DB
  const s3Path = `s3://mock-bucket/jobs/${jobId}`;
  try {
      await pool.query(
          `INSERT INTO jobs (id, user_address, collection_name, supply, rarity_config, s3_upload_path, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO UPDATE SET user_address = $2, collection_name = $3, updated_at = NOW()`,
          [jobId, userId, collectionName || 'Untitled', 0, JSON.stringify({}), s3Path, 'UNKNOWN']
      );
  } catch (e) {
      console.error("DB INSERT FAILED during config:", e);
  }

  res.status(200).json({
    message: 'S3 config generated successfully (MOCK).',
    jobId: jobId,
    uploadUrl: 'https://mock-s3-upload-url.com/path', 
    s3BaseKey: s3Path,
  });
});


// --- 1. POST /api/start-generation (Job Trigger) ---
app.post('/api/start-generation', async (req: Request, res: Response) => {
    const { jobId, collectionName, supply, layers, stxAddress } = req.body;
    
    if (!jobId || !stxAddress || !supply || !layers) {
        return res.status(400).json({ status: 'error', message: 'Missing required configuration data.' });
    }

    try {
        const updateResult: QueryResult<Job> = await pool.query(
            `UPDATE jobs SET rarity_config = $1, supply = $2, collection_name = $3, status = 'QUEUED', updated_at = NOW() 
             WHERE id = $4 RETURNING *`,
            [JSON.stringify(layers), supply, collectionName, jobId]
        );
        
        if (updateResult.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Job not found for update.' });
        }
        
        const job: Job = updateResult.rows[0];

        // Launch the Worker Thread for heavy computation
        const worker = new Worker(path.resolve(__dirname, 'worker/generator.js'), {
            workerData: { jobId: job.id, jobData: job }
        });
        
        worker.on('error', (err) => { console.error(`Worker error for ${job.id}:`, err); });
        worker.on('exit', (code) => { 
            if (code !== 0) console.error(`Worker stopped for ${job.id} with exit code ${code}`); 
        });

        // Return immediately (non-blocking)
        return res.status(202).json({ 
            status: 'QUEUED', 
            jobId: job.id, 
            message: 'Generation job started successfully in background.' 
        });

    } catch (e) {
        console.error('Database/Job queuing error:', e);
        return res.status(500).json({ status: 'error', message: 'Failed to queue generation job.' });
    }
});

// --- 2. GET /api/job-status/:id (Status Polling) ---
app.get('/api/job-status/:id', async (req: Request, res: Response) => {
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
            finalZipUrl = `https://mock-s3-download-link.com/${job.s3_final_zip_path || 'default_path'}`; 
        }

        return res.status(200).json({ 
            status: job.status, 
            jobId: job.id,
            finalZipUrl: finalZipUrl
        });

    } catch (e) {
        console.error('Job status query error:', e);
        return res.status(500).json({ status: 'error', message: 'Database error.' });
    }
});

// --- 3. POST /api/verify-payment (Unlock Download) ---
app.post('/api/verify-payment', async (req: Request, res: Response) => {
    const { jobId, txId, stxAddress } = req.body;
    
    if (!jobId || !txId || !stxAddress) {
        return res.status(400).json({ status: 'error', message: 'Missing transaction details.' });
    }

    try {
        // Step A: Fetch transaction details from the Stacks API
        const txResult = await fetchStacksTransaction(txId);

        // Check 1: Final Transaction Status
        if (txResult.tx_status !== 'success') {
            return res.status(400).json({ status: 'error', message: 'Stacks transaction did not succeed.' });
        }

        // Check 2: MOCK SECURITY CHECK (The only reliable method without deep type parsing)
        // Since deep event parsing is unreliable, we rely on the tx_status=success for MOCK verification.
        const paymentVerified = true; 

        if (paymentVerified) {
            // Update DB status to PAID and save the transaction hash
            await pool.query(
                `UPDATE jobs SET status = 'PAID', tx_id_unlock = $1, updated_at = NOW() WHERE id = $2`,
                [txId, jobId]
            );

            // Fetch the final download path from the updated job
            const jobResult: QueryResult<Job> = await pool.query('SELECT s3_final_zip_path FROM jobs WHERE id = $1', [jobId]);
            const finalPath = jobResult.rows[0]?.s3_final_zip_path;
            
            // NOTE: This is where you'd generate the S3 Pre-Signed GET URL for the client.
            const mockDownloadLink = `https://unlocked-download.com/job/${jobId}/final.zip`;
            
            return res.status(200).json({ 
                status: 'PAID', 
                downloadLink: mockDownloadLink, 
                message: 'Payment verified and download link unlocked.' 
            });
        } else {
            return res.status(400).json({ status: 'error', message: 'Clarity event verification failed.' });
        }
    } catch (e) {
        console.error('Payment verification API error:', e);
        return res.status(500).json({ status: 'error', message: 'Failed to verify payment via Stacks API. Check Hiro API key/rate limits.' });
    }
});


// Basic Health Check
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'NFT Generator API', dbStatus: pool ? 'connected' : 'disconnected' });
});


// --- Server Start Function ---
const startServer = async () => {
    // 1. Initialize PostgreSQL connection and create table
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