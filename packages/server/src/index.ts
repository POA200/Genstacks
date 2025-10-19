// /packages/server/src/index.ts (FIXED VERSION)

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid'; 

dotenv.config();

const app = express();
// Render environment will set the PORT variable
const PORT = process.env.PORT || 10000; 

// Middleware Setup
app.use(express.json());

// --- CRITICAL CORS CONFIGURATION ---
const allowedOrigins = [
  'https://genstacks.vercel.app', // VITE dev server - MUST be included!
  // Add your Vercel deployment URL here later: 'https://your-live-vercel-domain.vercel.app', 
];

app.use(cors({
  // FIX: Use the simplest function signature (origin: any, callback: any) 
  // TypeScript will accept this, relying on the @types/cors definitions
  // and preventing the TS2305 error related to complex type imports.
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // 1. Allow requests with no origin (e.g., direct API testing, or tools like Postman)
    if (!origin) return callback(null, true); 
    
    // 2. Check if the origin is in our safe list
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy blocked access from Origin: ${origin}`;
      console.error(msg);
      // Deny access if the origin is not allowed
      return callback(new Error(msg), false);
    }
    
    // 3. Allow access
    return callback(null, true);
  },
  methods: ['GET', 'POST'],
  credentials: true,
}));
// ------------------------------------

// --- MOCK API ENDPOINT ---
app.post('/api/generate-s3-upload-config', (req: Request, res: Response) => {
  // Use a console log that Render will display in its logs
  console.log(`[JOB MOCK] Received request for: ${req.body.collectionName}`);

  // MOCK: Respond with the required structure to allow frontend to proceed
  const jobId = req.body.jobId || uuidv4(); 
  const s3BaseKey = `jobs/${jobId}/layers/`;

  res.status(200).json({
    message: 'S3 upload config generated successfully (MOCK).',
    jobId: jobId,
    uploadUrl: 'https://mock-s3-upload-url.com/path', 
    s3BaseKey: s3BaseKey,
  });
});

// Basic Health Check
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'NFT Generator API' });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});