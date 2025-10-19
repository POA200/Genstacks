// /packages/server/src/index.ts

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid'; // Need to install 'uuid' if you haven't yet

dotenv.config();

const app = express();
// Render environment will set the PORT variable
const PORT = process.env.PORT || 10000; 

// Middleware Setup
app.use(express.json());

// --- CRITICAL CORS CONFIGURATION ---
const allowedOrigins = [
  'http://localhost:5173', // VITE dev server - MUST be included!
  // 'https://your-live-vercel-domain.vercel.app', // Add this later
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., direct API testing)
    if (!origin) return callback(null, true); 
    if (allowedOrigins.indexOf(origin) === -1) {
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

// --- MOCK API ENDPOINT ---
// This endpoint is what your frontend LayerUploadStep.tsx is calling
app.post('/api/generate-s3-upload-config', (req: Request, res: Response) => {
  console.log(`Received job request: ${req.body.collectionName}`);

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