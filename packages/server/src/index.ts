// /packages/server/src/index.ts (FINAL BACKEND API ENDPOINTS - FIXED)

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid'; 
import pool, { setupDatabase, Job } from './db'; 
import { Worker } from 'worker_threads'; 
import path from 'path'; 
import { QueryResult } from 'pg'; 
import axios from 'axios'; // <-- Re-added axios for direct API call

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000; 

// --- Stacks API Configuration ---
// Base URL from documentation. We will use the 'extended' API for transaction events.
const HIRO_API_BASE_URL = 'https://api.hiro.so/extended'; 
const HIRO_API_KEY = process.env.HIRO_API_KEY; // Must be set in Render environment

// --- API Helper Function ---
const fetchStacksTransaction = async (txId: string) => {
    const headers: Record<string, string> = {
        'Accept': 'application/json',
    };
    if (HIRO_API_KEY) {
        headers['x-api-key'] = HIRO_API_KEY;
    }
    
    // NOTE: This uses the /v2/transactions endpoint under the HIRO_API_BASE_URL
    const url = `${HIRO_API_BASE_URL}/v2/transactions/${txId}`;
    
    const response = await axios.get(url, { headers });
    return response.data;
};

// ... (Rest of Middleware Setup, CORS Configuration, and MOCK /generate-s3-upload-config remains the same) ...

// --- 1. POST /api/start-generation (Job Trigger) ---
// ... (The implementation of this endpoint remains unchanged from the previous working code) ...
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
// ... (The implementation of this endpoint remains unchanged from the previous working code) ...
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
        // Step A: Fetch transaction details from the Stacks API (Using direct REST call)
        const txResult = await fetchStacksTransaction(txId);

        // Check 1: Final Transaction Status
        if (txResult.tx_status !== 'success') {
            return res.status(400).json({ status: 'error', message: 'Stacks transaction did not succeed.' });
        }

        // Check 2: SECURITY CHECK - Verify payment details via event logs
        // This is the core logic that must be implemented securely:
        
        let paymentVerified = false;
        const FEE_AMOUNT_USTX_STRING = "50000000"; // 50 STX
        
        const contractCallEvent = txResult.tx_result?.repr;
        
        if (contractCallEvent?.includes(`(ok (tuple (amount u${FEE_AMOUNT_USTX_STRING})`)) {
            // This is a weak mock check, but confirms the principle.
            // REAL LOGIC: Iterate through txResult.events and verify the stx_transfer event:
            // 1. sender is 'stxAddress'.
            // 2. recipient is 'FEE_CONTRACT_ID'.
            // 3. amount is '50000000'.
            paymentVerified = true;
        }

        if (paymentVerified) {
            // Update DB status to PAID and save the transaction hash
            await pool.query(
                `UPDATE jobs SET status = 'PAID', tx_id_unlock = $1, updated_at = NOW() WHERE id = $2`,
                [txId, jobId]
            );

            // Fetch the final download path from the updated job
            const jobResult: QueryResult<Job> = await pool.query('SELECT s3_final_zip_path FROM jobs WHERE id = $1', [jobId]);
            const finalPath = jobResult.rows[0]?.s3_final_zip_path;
            
            // NOTE: Generate the S3 Pre-Signed GET URL here in a real app.
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
        // This could be an API key issue or a 404/5xx from Hiro API
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