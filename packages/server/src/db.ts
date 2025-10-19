import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// The database URL will be provided by Render as an Environment Variable (DATABASE_URL)
// We rely on the Render environment to set this up.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("FATAL ERROR: DATABASE_URL environment variable is not set.");
    // In a real production app, we would not exit, but return a failed state.
    // Here, we throw to ensure the startServer function fails immediately.
    throw new Error("DATABASE_URL environment variable is required.");
}

// Create a connection pool to handle multiple concurrent requests
const pool = new Pool({
    connectionString: connectionString,
    // Add SSL support for Render's requirements in production
    ssl: {
        rejectUnauthorized: false, // Required to connect from Render's Node.js environment
    },
});

pool.on('error', (err) => {
    // Log fatal errors and attempt to restart or notify
    console.error('Unexpected error on idle PostgreSQL client:', err);
    // Note: Render will often restart the service if it crashes.
});

// Interface for a Job in the Database (Mirroring the frontend state)
export interface Job {
    id: string; // Job ID (UUID)
    user_address: string; // Stacks address of the user
    collection_name: string;
    supply: number;
    rarity_config: any; // JSONB storage for layers/traits
    s3_upload_path: string; // Path to the uploaded layers in S3
    s3_final_zip_path: string | null; // Path to the final generated file
    status: 'QUEUED' | 'GENERATING' | 'COMPLETE' | 'PAID' | 'FAILED' | 'UNKNOWN';
    tx_id_unlock: string | null; // Stacks Transaction ID for payment
    created_at: Date;
    updated_at: Date;
}

/**
 * Initializes the database by creating the 'jobs' table if it doesn't exist.
 */
export const setupDatabase = async () => {
    const client = await pool.connect();
    try {
        const queryText = `
        CREATE TABLE IF NOT EXISTS jobs (
            id UUID PRIMARY KEY,
            user_address TEXT NOT NULL,
            collection_name TEXT NOT NULL,
            supply INTEGER NOT NULL,
            rarity_config JSONB NOT NULL,
            s3_upload_path TEXT,
            s3_final_zip_path TEXT,
            status TEXT NOT NULL DEFAULT 'QUEUED',
            tx_id_unlock TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        `;
        await client.query(queryText);
        console.log('PostgreSQL: "jobs" table verified/created successfully.');
    } catch (err) {
        console.error('PostgreSQL setup error:', err);
        throw err;
    } finally {
        client.release();
    }
};

// Export the pool instance to be used for queries across the API
export default pool;
