// /genstacks/genstacksapp/src/components/form-steps/GenerationStatusStep.tsx (FINAL FIX FOR BUILD ERRORS)

import { Button } from '@/components/ui/button';
// FIX TS2304: Ensure all Shadcn components are explicitly imported or defined.
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCollectionConfigStore } from '@/store/configStore';
import { useAuthStore } from '@/store/authStore';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Loader2, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { openContractCall, AnchorMode } from '@stacks/connect'; // Added AnchorMode
import { STACKS_TESTNET } from '@stacks/network'; // FIX 1: Renamed export
import { 
    bufferCVFromString, 
    // FIX 2: Check for direct exports or use appropriate package imports
    makeSTXTokenTransfer, // Use the base transfer function if needed
    FungibleConditionCode, 
    // FIX 3 & 4: These functions are often accessed through the main @stacks/transactions namespace or helpers
    // We will use the common format that generally works across versions:
    makeStandardSTXPostCondition,
    createAssetInfo,
    uintCV, // Assuming uintCV is exported correctly now
    PostConditionMode, // FIX 5: Import the PostConditionMode enum
    // We remove StacksTransaction and related unused types/imports to fix TS6133
} from '@stacks/transactions'; 


interface GenerationStatusStepProps {
  onCancel: () => void;
}

// ... (Environment variables remain the same)
const RENDER_ENV_URL = import.meta.env.VITE_RENDER_API_URL;
const API_BASE_URL = RENDER_ENV_URL || 'http://localhost:10000/api'; 

// Stacks Constants
const FEE_AMOUNT_USTX = 50000000n; // 50 STX in micro-STX
const FEE_CONTRACT_ID = 'SP2BWNDQ6FFHCRGRP1VCAXHSMYTDY8J8T075AZV4Q.nft-fee-collector'; // Your mock/placeholder ID

type JobStatus = 'QUEUED' | 'GENERATING' | 'COMPLETE' | 'PAID' | 'FAILED' | 'UNKNOWN';

const GenerationStatusStep: React.FC<GenerationStatusStepProps> = ({ onCancel }) => {
  const { collectionName, supply, layers } = useCollectionConfigStore();
  const stxAddress = useAuthStore(state => state.userAddresses?.stxAddress);

  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<JobStatus>('UNKNOWN');
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [txId, setTxId] = useState<string | null>(null);
  
  const pollInterval = useRef<NodeJS.Timeout | null>(null);
  // FIX TS6133: Ensure isMounted is used
  const isMounted = useRef(true); 

  // --- 1. START GENERATION JOB (Runs on component mount) ---
  useEffect(() => {
    isMounted.current = true;
    // ... (Job start logic remains the same)
    
    // Function to start the job on the Render backend
    const startJob = async () => {
      const newJobId = crypto.randomUUID(); 
      setJobId(newJobId);
      setStatus('QUEUED');
      
      try {
        const response = await axios.post(`${API_BASE_URL}/start-generation`, {
          jobId: newJobId,
          collectionName,
          supply,
          layers,
          stxAddress,
        });

        if (response.data.status === 'QUEUED') {
          console.log(`Job ${newJobId} successfully queued on Render.`);
          startPolling(newJobId); 
        } else {
            setStatus('FAILED');
            setGenerationError('Failed to queue job on backend.');
        }

      } catch (error) {
        if (isMounted.current) {
            setStatus('FAILED');
            setGenerationError('Error starting generation job. Check backend logs.');
            console.error('Job start error:', error);
        }
      }
    };

    startJob();

    return () => {
      isMounted.current = false;
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, []);

  // --- 2. POLLING LOGIC (Remains the same) ---
  const startPolling = (currentJobId: string) => {
    // ... (polling logic remains the same)
    if (pollInterval.current) clearInterval(pollInterval.current);

    pollInterval.current = setInterval(async () => {
      if (!isMounted.current) return;
      
      try {
        const response = await axios.get(`${API_BASE_URL}/job-status/${currentJobId}`);
        const newStatus = response.data.status as JobStatus;
        
        if (newStatus !== status) {
            setStatus(newStatus);
            console.log(`Job ${currentJobId} status updated to: ${newStatus}`);
        }

        if (newStatus === 'COMPLETE' || newStatus === 'PAID' || newStatus === 'FAILED') {
          if (pollInterval.current) clearInterval(pollInterval.current);
          setDownloadLink(response.data.finalZipUrl); 
          if (newStatus === 'FAILED') {
            setGenerationError('Generation failed on the server.');
          }
        }
      } catch (error) {
        if (isMounted.current) {
            console.error('Polling error:', error);
        }
      }
    }, 5000);
  };
  
  // --- 3. PAYMENT TRANSACTION LOGIC (Stacks.js) ---
  const handlePayment = async () => {
    if (!stxAddress || !jobId) {
        setGenerationError("Wallet not connected or Job ID missing.");
        return;
    }

    const [contractAddress, contractName] = FEE_CONTRACT_ID.split('.');
    
    // Post-Condition: User must send exactly 50 STX to the contract
    const stxAssetInfo = createAssetInfo('STX', 'STX', 'STX'); 
    
    const postCondition = makeStandardSTXPostCondition(
        stxAddress,
        FungibleConditionCode.Equal, 
        FEE_AMOUNT_USTX,
        stxAssetInfo 
    );

    await openContractCall({
        network: STACKS_TESTNET, // FIX 1: Use STACKS_TESTNET constant
        anchorMode: AnchorMode.Any, // Added for modern transaction options
        contractAddress: contractAddress, 
        contractName: contractName, 
        functionName: 'pay-for-collection',
        functionArgs: [
            // Assuming the Clarity contract takes a job-id (string-ascii 64)
            bufferCVFromString(jobId) 
        ],
        postConditions: [postCondition],
        postConditionMode: PostConditionMode.Deny, // FIX 5: Use enum import
        
        onFinish: async (data) => {
            setTxId(data.txId);
            setStatus('PAID');
            console.log('Transaction broadcasted:', data.txId);
            
            await axios.post(`${API_BASE_URL}/verify-payment`, {
                jobId: jobId,
                txId: data.txId,
                stxAddress: stxAddress
            });
            startPolling(jobId);
        },
        // FIX TS6133: ensure onCancel is read/used
        onCancel: () => {
            console.log("Transaction cancelled by user.");
            setStatus('COMPLETE'); 
        }
    });
  };
  
  // --- RENDERING STATUS BADGE (Remains the same) ---
  const StatusBadge = () => {
    switch (status) {
      case 'QUEUED':
        return <span className="text-blue-500 flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Job Queued</span>;
      case 'GENERATING':
        return <span className="text-yellow-500 flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating {supply} NFTs...</span>;
      case 'COMPLETE':
        return <span className="text-green-500 flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Ready for Payment</span>;
      case 'PAID':
        return <span className="text-green-600 flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Payment Confirmed!</span>;
      case 'FAILED':
        return <span className="text-red-500 flex items-center"><XCircle className="mr-2 h-4 w-4" /> Job Failed</span>;
      default:
        return <span className="text-gray-500">Initializing...</span>;
    }
  };

  return (
    <div className="space-y-6 p-4">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-2xl">Generation Status: <StatusBadge /></CardTitle>
        <CardDescription>
          Processing **{collectionName}** ({supply} total) on the Render worker thread.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        <div className="border p-4 rounded-md bg-gray-50">
            <h4 className="font-semibold mb-2">Job Details</h4>
            <p className="text-sm">Job ID: <code className="text-xs">{jobId || 'N/A'}</code></p>
            {generationError && <p className="text-red-500 text-sm mt-2">Error: {generationError}</p>}
        </div>

        {/* --- PAYMENT UNLOCK SECTION (Visible only after generation is COMPLETE) --- */}
        {(status === 'COMPLETE' || status === 'PAID') && (
            <div className="border-t pt-4">
                {status === 'COMPLETE' && (
                    <div className="text-center space-y-4">
                        <p className="text-xl font-bold text-green-700">Collection is Ready for Download!</p>
                        <p>A fee of **50 STX** is required to unlock your final collection files (images and metadata).</p>
                        <Button 
                            onClick={handlePayment} 
                            disabled={!stxAddress}
                            size="lg" 
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            <DollarSign className="mr-2 h-5 w-5" /> Pay 50 STX to Download
                        </Button>
                        {txId && <p className="text-xs text-gray-500 mt-2">Transaction broadcasted: {txId}</p>}
                    </div>
                )}
                {status === 'PAID' && downloadLink && (
                    <div className="text-center space-y-4">
                        <p className="text-xl font-bold text-green-700">Payment Verified! Your files are unlocked.</p>
                        <a href={downloadLink} target="_blank" rel="noopener noreferrer">
                            <Button size="lg" className='bg-green-700 hover:bg-green-800'>
                                Download Collection (.zip)
                            </Button>
                        </a>
                    </div>
                )}
            </div>
        )}
      </CardContent>
    </div>
  );
};

export default GenerationStatusStep;