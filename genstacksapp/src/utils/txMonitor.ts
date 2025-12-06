// src/utils/txMonitor.ts

import axios from 'axios';

// Polling interval (check every 5 seconds)
const POLL_INTERVAL = 5000;

// Maximum polling duration (5 minutes)
const MAX_POLL_DURATION = 5 * 60 * 1000;

export interface TransactionMonitorCallbacks {
  onSuccess: (txData: any) => void;
  onError: (error: string, txData?: any) => void;
  onPending: (retryCount: number) => void;
}

/**
 * Monitors a Stacks transaction status until it's confirmed or fails.
 *
 * @param txId - The transaction ID to monitor
 * @param network - StacksMainnet or StacksTestnet instance
 * @param callbacks - Object with onSuccess, onError, and onPending callbacks
 * @returns cleanup function to stop monitoring
 */
export const monitorTransactionStatus = (
  txId: string,
  networkMode: 'testnet' | 'mainnet',
  callbacks: TransactionMonitorCallbacks
): (() => void) => {
  const apiUrl = networkMode === 'mainnet' 
    ? 'https://api.mainnet.hiro.so'
    : 'https://api.testnet.hiro.so';
  let retryCount = 0;
  let isCleanedUp = false;

  const intervalId = setInterval(async () => {
    if (isCleanedUp) {
      clearInterval(intervalId);
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/v2/transactions/${txId}`);
      const txData = response.data;

      console.log(`📊 Transaction status (${retryCount}): ${txData.tx_status}`);

      // SUCCESS: Transaction confirmed on-chain
      if (txData.tx_status === 'success') {
        clearInterval(intervalId);
        isCleanedUp = true;

        console.log('✅ TRANSACTION CONFIRMED & SUCCESSFUL!');
        console.log('Transaction data:', txData);

        // Parse the contract call result
        if (txData.contract_call && txData.contract_call.result_raw) {
          // In Clarity, (ok true) is typically represented as 0x0701
          // (ok) = 0x07, true = 0x01
          const resultRaw = txData.contract_call.result_raw;
          if (resultRaw === '0x0701' || resultRaw.includes('0701')) {
            console.log('✅ Contract execution returned (ok true)');
            callbacks.onSuccess(txData);
          } else {
            console.warn('⚠️ Contract returned unexpected result:', resultRaw);
            callbacks.onError('Contract returned unexpected result', txData);
          }
        } else {
          // If no result_raw, assume success based on tx_status
          callbacks.onSuccess(txData);
        }

        return;
      }

      // PENDING: Transaction is in mempool or being processed
      if (txData.tx_status === 'pending') {
        retryCount++;
        callbacks.onPending(retryCount);

        // Check if we've been polling for too long
        if (retryCount * POLL_INTERVAL > MAX_POLL_DURATION) {
          clearInterval(intervalId);
          isCleanedUp = true;
          callbacks.onError('Transaction polling timeout. Check transaction status manually.');
          return;
        }
      }

      // FAILURE: Transaction aborted by response (contract error)
      if (txData.tx_status === 'abort_by_response') {
        clearInterval(intervalId);
        isCleanedUp = true;

        const errorMsg = txData.tx_cause
          ? `Contract error: ${txData.tx_cause}`
          : 'Transaction failed due to contract error';

        console.error('❌ TRANSACTION FAILED:', errorMsg);
        callbacks.onError(errorMsg, txData);
        return;
      }

      // FAILURE: Transaction dropped from mempool
      if (txData.tx_status === 'dropped_replace_by_fee' || txData.tx_status === 'dropped_stale') {
        clearInterval(intervalId);
        isCleanedUp = true;

        const errorMsg = `Transaction dropped: ${txData.tx_status}`;
        console.error('❌', errorMsg);
        callbacks.onError(errorMsg, txData);
        return;
      }

    } catch (error) {
      // If transaction not found yet, it's still in mempool (normal for first few checks)
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        retryCount++;
        callbacks.onPending(retryCount);

        // Check timeout
        if (retryCount * POLL_INTERVAL > MAX_POLL_DURATION) {
          clearInterval(intervalId);
          isCleanedUp = true;
          callbacks.onError('Transaction not found within timeout period.');
        }
      } else {
        console.error('❌ Error fetching transaction status:', error);
        callbacks.onError(`Error monitoring transaction: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }, POLL_INTERVAL);

  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    isCleanedUp = true;
  };
};

/**
 * Helper function to check if a payment was successful from transaction data
 */
export const isPaymentSuccessful = (txData: any): boolean => {
  if (txData.tx_status !== 'success') {
    return false;
  }

  // Check for contract call result if available
  if (txData.contract_call && txData.contract_call.result_raw) {
    return txData.contract_call.result_raw === '0x0701' || txData.contract_call.result_raw.includes('0701');
  }

  // If no result_raw available, consider it successful based on tx_status
  return true;
};
