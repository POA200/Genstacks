import { parentPort, workerData } from 'worker_threads';
import sharp from 'sharp';
import pool from '../db';
import { Job } from '../db';

// Worker data payload type
interface WorkerPayload {
    jobId: string;
    // We expect the backend entry point to fetch the full job details
    // and pass them here.
    jobData: Job; 
}

const { jobId, jobData } = workerData as WorkerPayload;

// --- UTILITY: Update Job Status in DB ---
const updateJobStatus = async (status: Job['status'], finalZipPath: string | null = null, error: string | null = null) => {
    const client = await pool.connect();
    try {
        const setQuery = finalZipPath ? 'status = $1, s3_final_zip_path = $2, updated_at = NOW()' : 
                         error ? 'status = $1, updated_at = NOW(), s3_final_zip_path = $3' : 
                         'status = $1, updated_at = NOW()';
        
        const params: (string | null)[] = [status];
        if (finalZipPath) params.push(finalZipPath);
        if (error) params.push(error);
        
        await client.query(
            `UPDATE jobs SET ${setQuery} WHERE id = $${params.length + 1}`,
            [...params, jobId]
        );
        console.log(`[Job ${jobId}] Status updated to: ${status}`);
    } catch (err) {
        console.error(`[Job ${jobId}] Failed to update status in DB:`, err);
    } finally {
        client.release();
    }
};

// --- CORE GENERATION FUNCTION ---
const startGeneration = async () => {
    console.log(`[Job ${jobId}] Starting generation of ${jobData.supply} NFTs...`);
    
    // Safety check: ensure S3 paths are set
    if (!jobData.s3_upload_path) {
        await updateJobStatus('FAILED', null, 'Missing S3 upload path.');
        return;
    }

    try {
        await updateJobStatus('GENERATING');
        
        // --- STEP A: SIMULATE IMAGE GENERATION ---
        // REAL LOGIC: 
        // 1. Download all layers from jobData.s3_upload_path
        // 2. Run the randomization algorithm based on jobData.rarity_config
        // 3. Use sharp to composite images into final NFTs (up to 10,000)
        // 4. Generate all metadata JSON files
        // 5. Zip all images and metadata into one file (e.g., final_collection.zip)

        // MOCK: Simulate long-running CPU work
        const totalDuration = jobData.supply * 0.005; // 5ms per NFT
        await new Promise(resolve => setTimeout(resolve, Math.min(totalDuration * 1000, 30000))); // Cap at 30s mock

        const finalZipPath = `s3://${jobData.s3_upload_path.split('/')[2]}/${jobId}/final_collection.zip`;
        
        // --- STEP B: FINAL STATUS ---
        await updateJobStatus('COMPLETE', finalZipPath);

        // Notify the main thread that the job is complete
        parentPort?.postMessage({ status: 'SUCCESS', jobId: jobId, finalZipPath });

    } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown generation error';
        await updateJobStatus('FAILED', null, errMsg);
        parentPort?.postMessage({ status: 'FAILED', jobId: jobId, error: errMsg });
    }
};

startGeneration();
