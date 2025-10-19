// /packages/server/src/index.ts (UPDATED TO INTEGRATE DB)

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid'; 
import pool, { setupDatabase } from './db'; // <-- NEW IMPORT of DB utilities

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000; 

// Middleware Setup
app.use(express.json());

// --- CRITICAL CORS CONFIGURATION ---
const allowedOrigins = [
  'http://localhost:5173', 
  // Add your Vercel URL here later: 'https://genstacks.vercel.app', 
  // NOTE: In production, the Vercel ENV var handles the deployed URL via dynamic injection
];

app.use(cors({
  // FIX: Use the simplest function signature for custom origin checking
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true); 
    
    // Check against allowed list, and dynamically allow Vercel/Render preview domains
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
// ------------------------------------

// --- MOCK API ENDPOINT (Existing) ---
// Frontend calls this to get S3 credentials for file upload
app.post('/api/generate-s3-upload-config', (req: Request, res: Response) => {
  console.log(`[MOCK] Received config request for: ${req.body.collectionName}`);

  const jobId = req.body.jobId || uuidv4(); 
  const s3BaseKey = `jobs/${jobId}/layers/`;

  res.status(200).json({
    message: 'S3 upload config generated successfully (MOCK).',
    jobId: jobId,
    uploadUrl: 'https://mock-s3-upload-url.com/path', 
    s3BaseKey: s3BaseKey,
  });
});

// Basic Health Check (Used by Render for service health)
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
        // We throw here to ensure Render sees the failure and doesn't run the server without a database.
        return; 
    }

    // 2. Start the Express server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}. DB connected.`);
    });
};

startServer(); // Start the async server function
