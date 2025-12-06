// functions/generate.ts

import { VercelRequest, VercelResponse } from '@vercel/node';
import { CollectionConfig, TraitVariant, TraitLayer } from '../src/types/collection';
import sharp from 'sharp';
import axios from 'axios';
import JSZip from 'jszip';

// --- CONFIGURATION ---
const IPFS_GATEWAY_URL = process.env.VITE_IPFS_GATEWAY_URL || 'https://ipfs.io/ipfs/';
const PINATA_JWT_SERVERLESS = process.env.PINATA_JWT_SERVERLESS;
const PINATA_UPLOAD_URL = 'https://uploads.pinata.cloud/v3/files';

// Define the maximum attempts before declaring the collection impossible
const MAX_RETRIES = 50;

// --- HELPER FUNCTIONS ---

/**
 * Helper function to fetch an image from IPFS as a Buffer
 */
const fetchAsset = async (assetId: string): Promise<Buffer> => {
  const ipfsGatewayUrl = process.env.VITE_IPFS_GATEWAY_URL || 'https://ipfs.io/ipfs/';
  const url = `${ipfsGatewayUrl}${assetId}`;

  const response = await axios.get(url, {
    responseType: 'arraybuffer', // Crucial for getting raw image data
    timeout: 30000 // 30 seconds timeout
  });

  return Buffer.from(response.data);
};

/**
 * Helper function to select a trait based on weight (rarity)
 */
const pickWeightedTrait = (variants: TraitVariant[]): TraitVariant => {
  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
  let random = Math.random() * totalWeight;

  for (const variant of variants) {
    if (random < variant.weight) {
      return variant;
    }
    random -= variant.weight;
  }
  // Should ideally never be reached, but return the last one as fallback
  return variants[variants.length - 1];
};

/**
 * Helper function to validate selected traits against exclusion rules
 * Returns true if the combination is valid, false if any exclusion rule is violated
 */
const validateExclusions = (selectedVariants: TraitVariant[], allLayers: TraitLayer[]): boolean => {
  // Collect all selected trait names for quick lookup
  const selectedNames = new Set(selectedVariants.map(v => v.name));

  for (const layer of allLayers) {
    if (!layer.exclusionRules || layer.exclusionRules.length === 0) continue;

    const selectedVariantInLayer = selectedVariants.find(v => 
      layer.variants.some(lv => lv.name === v.name)
    );

    if (selectedVariantInLayer) {
      // Simple check: If this layer's selected trait name is in an exclusion list, 
      // check if any of the excluded traits were also selected in other layers.
      // NOTE: A robust implementation requires parsing the exclusion rule string. 
      // For simplicity here, we assume a simple 'Trait X cannot be with Trait Y' rule.

      // Example of a basic validation (assuming rules are stored as simple incompatible trait names):
      for (const excludedTraitName of layer.exclusionRules) {
        if (selectedNames.has(excludedTraitName)) {
          // console.log(`Exclusion failed: ${selectedVariantInLayer.name} combined with ${excludedTraitName}`);
          return false; // Validation failed
        }
      }
    }
  }
  return true; // All checks passed
};

/**
 * Upload final assets ZIP to Pinata using secure serverless JWT
 * This function uses Node.js Buffer directly (no browser FormData/Blob)
 */
const uploadFinalAssetsToPinata = async (buffer: Buffer, name: string): Promise<string> => {
  if (!PINATA_JWT_SERVERLESS) {
    throw new Error("PINATA_JWT_SERVERLESS not configured. Cannot upload final assets.");
  }

  console.log(`Uploading final ZIP of collection ID: ${name}`);

  try {
    // Use Node.js FormData (from form-data package or axios built-in)
    const FormData = require('form-data');
    const formData = new FormData();
    
    // Append the buffer as a file stream
    formData.append('file', buffer, {
      filename: `${name}.zip`,
      contentType: 'application/zip',
    });

    const response = await axios.post(
      PINATA_UPLOAD_URL,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${PINATA_JWT_SERVERLESS}`,
          ...formData.getHeaders(), // Include form-data headers
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 120000 // 2 minutes for large ZIP files
      }
    );

    const { data } = response.data;

    if (response.status !== 200 || !data?.cid) {
      throw new Error(`Pinata upload failed with status ${response.status}`);
    }

    console.log(`Successfully uploaded to Pinata with CID: ${data.cid}`);
    return data.cid;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Pinata Error:", error.response?.data || error.message);
    } else {
      console.error("General Pinata Upload Error:", error);
    }
    throw new Error(`Failed to upload final collection ZIP`);
  }
};

/**
 * Main image generation engine
 */
const startImageGeneration = async (config: CollectionConfig): Promise<string> => {
  const uniqueCombinations = new Set<string>();
  const traitCache = new Map<string, Buffer>(); // Cache buffers by CID/assetId
  const zip = new JSZip();

  // 1. Pre-sort layers by 'order' (Z-index) to ensure correct layering sequence
  const sortedLayers = [...config.layers].sort((a, b) => a.order - b.order);

  // --- TRAIT CACHING (Optimization for serverless cold start) ---
  console.log("Caching all unique trait buffers...");
  for (const layer of sortedLayers) {
    for (const variant of layer.variants) {
      if (!traitCache.has(variant.assetId)) {
        try {
          const buffer = await fetchAsset(variant.assetId);
          traitCache.set(variant.assetId, buffer);
        } catch (e) {
          console.error(`Failed to fetch asset ${variant.assetId}:`, e);
          throw new Error(`Critical error: Could not fetch asset ${variant.assetId}`);
        }
      }
    }
  }

  // --- GENERATION LOOP ---
  console.log(`Starting generation of ${config.size} NFTs...`);
  for (let i = 1; i <= config.size; i++) {
    let composition: sharp.OverlayOptions[] = [];
    const attributes: { trait_type: string; value: string }[] = [];
    const combinationKey: string[] = [];
    let selectedVariants: TraitVariant[] = [];

    // Loop until a unique and valid combination is found
    let attempts = 0;
    let isUnique = false;
    let isValid = false;
    
    do {
      composition = [];
      selectedVariants = [];
      combinationKey.length = 0;

      // A. Weighted Selection
      for (const layer of sortedLayers) {
        const selectedVariant = pickWeightedTrait(layer.variants);
        selectedVariants.push(selectedVariant);
        combinationKey.push(`${layer.name}:${selectedVariant.name}`);
      }

      // Check uniqueness and validity
      isUnique = !uniqueCombinations.has(combinationKey.join('|'));
      isValid = validateExclusions(selectedVariants, sortedLayers);

      // Increment attempt counter and check for collision limit
      if (!isUnique || !isValid) {
        attempts++;
        if (attempts > MAX_RETRIES) {
          // ❌ FATAL COLLISION ERROR
          console.error(`Fatal Error: Maximum retries (${MAX_RETRIES}) exceeded at edition ${i}.`);
          console.error(`Reason: ${!isUnique ? 'No unique combinations available' : 'Exclusion rules too restrictive'}`);
          // Update status store to FAILED with a clear message
          // updateStatusStore(config.id, { status: 'FAILED', errorMessage: 'Too few unique combinations possible given rarity rules.' });
          throw new Error("Generation halted due to collision constraints. Reduce collection size or adjust trait/exclusion rules.");
        }
      }

      // ⚠️ Uniqueness and Exclusion Check
    } while (!isUnique || !isValid);

    // Final success: record the unique, valid combination
    uniqueCombinations.add(combinationKey.join('|'));

    // B. Composition Preparation
    for (const [index, layer] of sortedLayers.entries()) {
      const variant = selectedVariants[index];
      const buffer = traitCache.get(variant.assetId);

      if (buffer) {
        composition.push({
          input: buffer,
          // Ensure all images are layered exactly on top of each other (x, y at 0, 0)
          left: 0,
          top: 0,
        });

        // Add to Metadata Attributes
        attributes.push({ trait_type: layer.name, value: variant.name });
      }
    }

    // C. Image Composition (Sharp)
    if (composition.length === 0) {
      throw new Error(`No valid composition for NFT #${i}`);
    }

    // Start with the bottom-most layer (first in composition array)
    const baseImage = sharp(composition[0].input as Buffer);

    const finalImageBuffer = await baseImage
      .composite(composition.slice(1)) // Composite all layers on top of the base
      .png() // Output as PNG (or JPEG/WebP for file size savings)
      .toBuffer();

    // D. Metadata Generation
    const metadata = {
      name: `${config.name} #${i}`,
      description: `A unique NFT from the ${config.name} collection.`,
      image: `images/${i}.png`, // Placeholder, updated after final IPFS upload
      edition: i,
      attributes: attributes,
    };

    // E. Add to ZIP archive
    zip.file(`images/${i}.png`, finalImageBuffer);
    zip.file(`metadata/${i}.json`, JSON.stringify(metadata, null, 2));
  }

  // --- FINAL STORAGE ---
  console.log("Generating final ZIP archive...");
  const finalZipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  // Upload the final ZIP to Pinata
  console.log("Uploading final collection to Pinata...");
  const finalZipCID = await uploadFinalAssetsToPinata(finalZipBuffer, config.id);

  // --- UPDATE METADATA WITH ACTUAL IPFS LINKS ---
  console.log("Updating metadata files with final IPFS gateway URLs...");
  const ipfsGatewayUrl = process.env.VITE_IPFS_GATEWAY_URL || 'https://ipfs.io/ipfs/';
  
  for (let i = 1; i <= config.size; i++) {
    // Retrieve the existing metadata from the ZIP
    const metadataFile = zip.file(`metadata/${i}.json`);
    if (metadataFile) {
      const metadataContent = await metadataFile.async('string');
      const metadata = JSON.parse(metadataContent);
      
      // Update the image field with the actual IPFS gateway URL
      metadata.image = `${ipfsGatewayUrl}${finalZipCID}/images/${i}.png`;
      
      // Re-add the updated metadata to the ZIP (replaces the old one)
      zip.file(`metadata/${i}.json`, JSON.stringify(metadata, null, 2));
    }
  }

  // Regenerate the ZIP with updated metadata
  console.log("Regenerating ZIP archive with updated metadata...");
  const updatedZipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  
  // Upload the updated ZIP to Pinata
  console.log("Uploading final collection with updated metadata to Pinata...");
  const finalUpdatedZipCID = await uploadFinalAssetsToPinata(updatedZipBuffer, config.id);

  // Return the CID of the final updated ZIP file
  return finalUpdatedZipCID;
};


/**
 * API endpoint to initiate the NFT collection generation process.
 * URL will be accessed via /api/generate (or /functions/generate on some setups).
 */
export default async (req: VercelRequest, res: VercelResponse) => {
  // Ensure the request is a POST request
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Type assertion for the configuration payload
  const config: CollectionConfig = req.body.config as CollectionConfig;

  // Basic validation check
  if (!config || !config.layers || config.layers.length === 0) {
    return res.status(400).send('Invalid or empty configuration payload.');
  }

  // LOGIC BLOCK START:
  try {
    // 1. (Future step: Add Stacks Authentication/Token Verification here)
    // 2. Trigger the heavy-lifting generation process
    const downloadId = await startImageGeneration(config);

    // 3. Return a success status
    return res.status(200).json({
      status: 'Generation Queued',
      downloadId: downloadId,
      message: 'Serverless function received configuration. Processing initiated.'
    });

  } catch (error) {
    console.error("Generation initiation error:", error);
    return res.status(500).json({ status: 'Error', message: 'Generation failed to initiate.' });
  }
};
