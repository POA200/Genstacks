// src/hooks/useGenerationStatus.ts

import { useState, useEffect } from 'react';
import axios from 'axios';
import type { GenerationStatus } from '../types/collection'; 

const POLLING_INTERVAL = 5000; // 5 seconds

/**
 * Custom hook to continuously poll the serverless status endpoint.
 * @param collectionId The unique ID of the collection job.
 * @returns The current GenerationStatus object.
 */
export const useGenerationStatus = (collectionId: string) => {
    const [status, setStatus] = useState<GenerationStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!collectionId) return;

        const pollStatus = async () => {
            try {
                // Adjust the API path to match Vercel's convention
                const response = await axios.get(`/api/status?id=${collectionId}`); 
                const newStatus: GenerationStatus = response.data;
                
                setStatus(newStatus);
                setIsLoading(false);

                // Stop polling if the job is terminal (complete or failed)
                if (newStatus.status === 'COMPLETE' || newStatus.status === 'FAILED') {
                    return true; 
                }
                return false; 

            } catch (error) {
                console.error("Polling error:", error);
                setIsLoading(false);
                setStatus({ status: 'FAILED', progressPercent: 0, totalImages: 0, currentImage: 0, errorMessage: 'Failed to connect to status endpoint.' } as GenerationStatus);
                return true; // Stop polling on error
            }
        };

        // Initial fetch
        pollStatus();

        // Start interval polling
        const intervalId = setInterval(() => {
            pollStatus().then(shouldStop => {
                if (shouldStop) {
                    clearInterval(intervalId);
                }
            });
        }, POLLING_INTERVAL);

        // Cleanup function
        return () => clearInterval(intervalId);
    }, [collectionId]);

    return { status, isLoading };
};
