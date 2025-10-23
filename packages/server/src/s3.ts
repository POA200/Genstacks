import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

// --- Configuration Constants ---
// CRITICAL: MUST be set in Render environment variables
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'your-mock-bucket';
const S3_REGION = process.env.S3_REGION || 'us-east-1'; 

// Initialize the S3 Client (Render requires environment variables to be set)
const s3Client = new S3Client({
    region: S3_REGION,
    // The AWS SDK automatically picks up access keys from Render's environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY).
});

/**
 * Generates a time-limited URL for the frontend to upload a file directly to S3.
 * @param key The full path and filename for the object in S3 (e.g., jobs/uuid/layers.zip)
 * @param contentType The expected file type (e.g., application/zip)
 * @returns A signed URL string for direct upload.
 */
export async function getUploadPreSignedUrl(key: string, contentType: string): Promise<string> {
    const putCommand = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
        ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, putCommand, { expiresIn: 3600 }); // URL expires in 1 hour
    return url;
}

/**
 * Generates a time-limited URL for the user to download the final zipped collection.
 * @param key The full path to the final zipped file in S3.
 * @returns A signed URL string for direct download.
 */
export async function getDownloadPreSignedUrl(key: string): Promise<string> {
    const getCommand = new GetObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
    });

    const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 300 }); // URL expires in 5 minutes
    return url;
}

// NOTE: You will need to configure the AWS credentials and S3 bucket 
// policies (CORS, permissions) outside of this code for it to work.