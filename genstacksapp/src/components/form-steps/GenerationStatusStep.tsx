// GenerationStatusStep: displays job status and handles payment flow
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useCollectionConfigStore } from "@/store/configStore";
import { useAuthStore } from "@/store/authStore";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Loader2, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { request } from "@stacks/connect";
import GenerationStatusCard from "@/components/GenerationStatusCard";

import type { ClarityValue } from "@stacks/transactions";
import { Cl, Pc } from "@stacks/transactions";
import type { CollectionConfig } from "@/types/collection";

interface GenerationStatusStepProps {
  onCancel?: () => void;
}

// Environment Variables
const RENDER_ENV_URL = import.meta.env.VITE_RENDER_API_URL;
const API_BASE_URL = RENDER_ENV_URL || "http://localhost:10000/api";

// Stacks Constants
const FEE_AMOUNT_USTX = 50000000n; // 50 STX in micro-STX
const FEE_CONTRACT_ID =
  "ST16R99CR18X1A20JBV0N546BH07HGWMKBRTCRK90.nft-fee-collector";

// Vercel Serverless Function URL
const GENERATE_API_URL = "/api/generate";

/**
 * Sends the collection configuration to the serverless function to begin computation.
 * @param config The full CollectionConfig object.
 */
const triggerServerlessGeneration = async (
  config: CollectionConfig
): Promise<void> => {
  console.log(`Sending config for generation: ${config.id}`);
  try {
    const response = await axios.post(GENERATE_API_URL, {
      config: config,
    });

    if (response.status === 200) {
      console.log("Serverless function successfully triggered.");
      console.log("Generation started with CID:", response.data.downloadId);
    } else {
      console.error("Failed to trigger serverless function:", response.data);
      throw new Error(
        "Error: Generation service failed to start. Check server logs."
      );
    }
  } catch (error) {
    console.error("Network error during serverless API call:", error);
    throw new Error(
      "Fatal Error: Could not connect to the generation service."
    );
  }
};

type JobStatus =
  | "QUEUED"
  | "GENERATING"
  | "COMPLETE"
  | "PAID"
  | "FAILED"
  | "UNKNOWN";

const GenerationStatusStep: React.FC<GenerationStatusStepProps> = () => {
  const { collectionName, supply, layers } = useCollectionConfigStore();
  const stxAddress = useAuthStore((state) => state.userAddresses?.stxAddress);

  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<JobStatus>("UNKNOWN");
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [txId, setTxId] = useState<string | null>(null);
  const [generationJobId, setGenerationJobId] = useState<string | null>(null);
  const pollInterval = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true); // --- 1. START GENERATION JOB ---

  useEffect(() => {
    isMounted.current = true; // The status check ensures the job is only started once
    if (status !== "UNKNOWN" && status !== "FAILED") return;

    const startJob = async () => {
      const newJobId = crypto.randomUUID();
      setJobId(newJobId);
      setStatus("QUEUED");
      try {
        const response = await axios.post(`${API_BASE_URL}/start-generation`, {
          jobId: newJobId,
          collectionName,
          supply,
          layers,
          stxAddress,
        });

        if (response.data.status === "QUEUED") {
          console.log(`Job ${newJobId} successfully queued on Render.`);
          startPolling(newJobId);
        } else {
          setStatus("FAILED");
          setGenerationError("Failed to queue job on backend.");
        }
      } catch (error) {
        if (isMounted.current) {
          setStatus("FAILED"); // The 404 from Render is fixed by the backend deployment, but error handling remains
          setGenerationError(
            "Error starting generation job. Check backend logs."
          );
          console.error("Job start error:", error);
        }
      }
    };

    startJob();

    return () => {
      isMounted.current = false;
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [stxAddress, status]); // Added status to dependency array for safety // --- 2. POLLING LOGIC (Remains the same) ---

  const startPolling = (currentJobId: string) => {
    if (pollInterval.current) clearInterval(pollInterval.current);

    pollInterval.current = setInterval(async () => {
      if (!isMounted.current) return;
      try {
        const response = await axios.get(
          `${API_BASE_URL}/job-status/${currentJobId}`
        );
        const newStatus = response.data.status as JobStatus;
        if (newStatus !== status) {
          setStatus(newStatus);
          console.log(`Job ${currentJobId} status updated to: ${newStatus}`);
        }

        if (
          newStatus === "COMPLETE" ||
          newStatus === "PAID" ||
          newStatus === "FAILED"
        ) {
          if (pollInterval.current) clearInterval(pollInterval.current);
          setDownloadLink(response.data.finalZipUrl);
          if (newStatus === "FAILED") {
            setGenerationError("Generation failed on the server.");
          }
        }
      } catch (error) {
        if (isMounted.current) {
          console.error("Polling error:", error);
        }
      }
    }, 5000);
  }; // --- 3. PAYMENT TRANSACTION LOGIC (Stacks.js) ---

  const handlePayment = async () => {
    if (!stxAddress || !jobId) {
      setGenerationError("Wallet not connected or Job ID missing.");
      return;
    }

    const [contractAddress, contractName] = FEE_CONTRACT_ID.split("."); // Construct the Post Condition using the 'Pc' namespace
    const postCondition = Pc.principal(stxAddress)
      .willSendEq(FEE_AMOUNT_USTX)
      .ustx(); // Construct the Clarity function arguments using the 'Cl' namespace

    const functionArgs: ClarityValue[] = [Cl.stringAscii(jobId)];

    try {
      const response = await request("stx_callContract", {
        contract: `${contractAddress}.${contractName}`,
        functionName: "pay-for-collection",
        functionArgs: functionArgs,
        postConditions: [postCondition],
        postConditionMode: "deny",
        network: "testnet", // Use string literal for network
      });
      const txid = (response as { txid: string }).txid;

      setTxId(txid);
      setStatus("PAID");
      await axios.post(`${API_BASE_URL}/verify-payment`, {
        jobId: jobId,
        txId: txid,
        stxAddress: stxAddress,
      });

      // Construct CollectionConfig from store data
      // Transform Layer[] to TraitLayer[] with required properties
      const traitLayers = layers.map((layer) => ({
        name: layer.name,
        order: layer.order,
        totalWeight: layer.traits.reduce((sum, trait) => sum + trait.rarity, 0),
        variants: layer.traits.map((trait) => ({
          name: trait.name,
          fileName: `${trait.name}.png`,
          assetId: trait.assetId || "",
          weight: trait.rarity,
          rarityPercent: trait.rarity,
        })),
      }));

      const collectionConfig: CollectionConfig = {
        id: jobId,
        name: collectionName,
        symbol: "GEN", // Default symbol
        size: supply,
        layers: traitLayers,
        metadataBaseUri: "",
        creatorAddress: stxAddress || "",
        isConfigured: true,
      };

      // Trigger the serverless generation function
      try {
        await triggerServerlessGeneration(collectionConfig);
        setGenerationJobId(jobId); // Activate the GenerationStatusCard
        startPolling(jobId);
      } catch (error) {
        console.error("Job start failed:", error);
        setGenerationError(
          error instanceof Error ? error.message : "Failed to start generation"
        );
      }
    } catch (error) {
      console.error("Transaction failed or was cancelled:", error);
      setStatus("COMPLETE");
    }
  };
  // --- RENDERING STATUS BADGE ---
  const StatusBadge: React.FC = () => {
    switch (status) {
      case "QUEUED":
        return (
          <span className="text-blue-500 flex items-center font-sans">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Job Queued
          </span>
        );
      case "GENERATING":
        return (
          <span className="text-yellow-500 flex items-center font-sans">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating{" "}
            {supply} NFTs...
          </span>
        );
      case "COMPLETE":
        return (
          <span className="text-green-500 flex items-center font-sans">
            <CheckCircle className="mr-2 h-4 w-4" /> Ready for Payment
          </span>
        );
      case "PAID":
        return (
          <span className="text-green-600 flex items-center font-sans">
            <CheckCircle className="mr-2 h-4 w-4" /> Payment Confirmed!
          </span>
        );
      case "FAILED":
        return (
          <span className="text-red-500 flex items-center font-sans">
            <XCircle className="mr-2 h-4 w-4" /> Job Failed
          </span>
        );
      default:
        return <span className="text-gray-500 font-sans">Initializing...</span>;
    }
  };

  return (
    <div className="space-y-6 p-4">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-2xl">
          Generation Status: <StatusBadge />
        </CardTitle>
        <CardDescription className="font-sans">
          Processing **{collectionName}** ({supply} total) on the Render worker
          thread.
        </CardDescription>
      </CardHeader>{" "}
      <CardContent className="p-0 space-y-4">
        <div className="border p-4 rounded-md bg-gray-50">
          <h4 className="font-semibold mb-2">Job Details</h4>
          <p className="text-sm font-sans">
            Job ID: <code className="text-xs font-sans">{jobId || "N/A"}</code>
          </p>
          {generationError && (
            <p className="text-red-500 text-sm mt-2 font-sans">
              Error: {generationError}
            </p>
          )}
        </div>
                {/* --- PAYMENT UNLOCK SECTION --- */}       {" "}
        {(status === "COMPLETE" || status === "PAID") && (
          <div className="border-t pt-4">
                           {" "}
            {status === "COMPLETE" && (
              <div className="text-center space-y-4">
                                       {" "}
                <p className="text-xl font-bold text-green-700 font-sans">
                  Collection is Ready for Download!
                </p>
                                       {" "}
                <p className="font-sans">
                  A fee of **50 STX** is required to unlock your final
                  collection files (images and metadata).
                </p>
                                       {" "}
                <Button
                  onClick={handlePayment}
                  disabled={!stxAddress}
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                                             {" "}
                  <DollarSign className="mr-2 h-5 w-5" /> Pay 50 STX to Download
                                         {" "}
                </Button>
                                       {" "}
                {txId && (
                  <p className="text-xs text-gray-500 mt-2">
                    Transaction broadcasted: {txId}
                  </p>
                )}
                                   {" "}
              </div>
            )}
                           {" "}
            {status === "PAID" && downloadLink && (
              <div className="text-center space-y-4">
                                       {" "}
                <p className="text-xl font-bold text-green-700">
                  Payment Verified! Your files are unlocked.
                </p>
                                       {" "}
                <a
                  href={downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                                             {" "}
                  <Button size="lg" className="bg-green-700 hover:bg-green-800">
                                                    Download Collection (.zip)  
                                             {" "}
                  </Button>
                                         {" "}
                </a>
                                   {" "}
              </div>
            )}
                       {" "}
          </div>
        )}
             {" "}
      </CardContent>
      {generationJobId && (
        <GenerationStatusCard collectionId={generationJobId} />
      )}
    </div>
  );
};

export default GenerationStatusStep;
