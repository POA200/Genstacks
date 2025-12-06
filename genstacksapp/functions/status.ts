// functions/status.ts

import { VercelRequest, VercelResponse } from '@vercel/node';
import { GenerationStatus } from '../src/types/collection'; // Assuming the interface is moved here

// Placeholder for the shared data store connection (e.g., Redis/DynamoDB)
// *** NOTE: Actual Redis connection and fetching is omitted in this phase. ***
const getStatusFromStore = async (collectionId: string): Promise<GenerationStatus | null> => {
    // Check if the environment variable is available (Simulated DB check)
    if (!process.env.UPSTASH_REDIS_URL) {
        console.warn("UPSTASH_REDIS_URL not configured. Returning simulated status.");
    }
    
    // Placeholder return for development/simulation
    const totalImages = 7777;
    const currentImage = Math.floor(Math.random() * totalImages * 0.9 + 1); // Random progress up to 90%
    const progressPercent = Math.round((currentImage / totalImages) * 100);

    // Simulate completion status 10% of the time for testing the complete state
    if (Math.random() > 0.9) {
        return {
            status: 'COMPLETE',
            progressPercent: 100,
            currentImage: totalImages,
            totalImages: totalImages,
            finalDownloadCID: 'QmVXFINALZIPCID',
            errorMessage: undefined,
        } as GenerationStatus;
    }

    return {
        status: 'GENERATING',
        progressPercent: progressPercent,
        currentImage: currentImage,
        totalImages: totalImages,
        finalDownloadCID: undefined,
    } as GenerationStatus;
};


export default async (req: VercelRequest, res: VercelResponse) => {
    const collectionId = req.query.id as string;

    if (!collectionId) {
        return res.status(400).send('Missing collection ID.');
    }

    try {
        const statusData = await getStatusFromStore(collectionId);

        if (!statusData) {
            return res.status(404).json({ status: 'NOT_FOUND', message: 'Job status not found.' });
        }

        return res.status(200).json(statusData);
    } catch (error) {
        console.error("Status check error:", error);
        return res.status(500).json({ status: 'ERROR', message: 'Error retrieving status.' });
    }
};
