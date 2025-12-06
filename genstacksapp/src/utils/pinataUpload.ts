// src/utils/pinataUpload.ts

import axios from 'axios';
// Optional: import the TraitVariant interface if you want to update it here
// import { TraitVariant } from '../types/collection';

// --- CONFIGURATION ---
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const UPLOAD_URL = import.meta.env.VITE_PINATA_UPLOAD_URL; // Should be https://uploads.pinata.cloud/v3/files

/**
 * Uploads a single file (trait image) to Pinata and returns the IPFS CID.
 * @param file The File object selected by the user.
 * @param traitName The human-readable name of the trait (used for Pinata metadata).
 * @returns The unique IPFS CID string.
 */
export const uploadTraitFile = async (
  file: File,
  traitName: string
): Promise<string> => {
  if (!PINATA_JWT) {
    throw new Error("Pinata JWT not configured in environment variables.");
  }

  const formData = new FormData();

  // 1. Append the file with the 'file' key (required by Pinata API)
  formData.append('file', file, file.name);

  // 2. Add optional metadata (useful for searching/organizing in Pinata dashboard)
  formData.append('name', traitName);
  formData.append('network', 'private'); // Use 'private' for better security control

  try {
    const response = await axios.post(
      UPLOAD_URL,
      formData,
      {
        headers: {
          // This header is essential for Pinata authentication
          'Authorization': `Bearer ${PINATA_JWT}`,
          // Axios/FormData will automatically set the 'Content-Type': 'multipart/form-data; boundary=...'
        },
        // IMPORTANT: Ensure the request does not timeout for large files
        timeout: 60000 // 60 seconds
      }
    );

    const { data } = response.data;

    if (response.status !== 200 || !data?.cid) {
      throw new Error(`Pinata upload failed with status ${response.status}. Data: ${JSON.stringify(response.data)}`);
    }

    // The unique IPFS Content Identifier
    const cid: string = data.cid;

    // console.log(`Successfully uploaded ${traitName}. CID: ${cid}`);
    return cid;

  } catch (error) {
    if (axios.isAxiosError(error)) {
        console.error("Axios Pinata Error:", error.response?.data || error.message);
    } else {
        console.error("General Pinata Upload Error:", error);
    }
    throw new Error(`Failed to upload trait file: ${traitName}. Check console for details.`);
  }
};
