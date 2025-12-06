// src/utils/stacksPayment.ts

import { stringAsciiCV } from '@stacks/transactions';

/**
 * Prepares payment transaction parameters for collection download.
 * These parameters are used with Stacks wallet integration.
 *
 * @param collectionId - The unique collection ID to associate with the payment
 * @returns Object containing transaction parameters
 */
export const preparePaymentTransactionParams = (collectionId: string) => {
  // Validate collection ID (must be <= 64 ASCII characters)
  if (collectionId.length > 64) {
    throw new Error('Collection ID must be 64 characters or less.');
  }

  // Define your contract details
  const CONTRACT_ADDRESS = import.meta.env.VITE_STACKS_CONTRACT_ADDRESS || 'ST16R99CR18X1A20JBV0N546BH07HGWMKBRTCRK90';
  const CONTRACT_NAME = import.meta.env.VITE_STACKS_CONTRACT_NAME || 'genstacks-fee';
  const FUNCTION_NAME = 'pay-for-collection-download';

  // Convert the collection ID into Clarity Value (CV) type
  const collectionIdCV = stringAsciiCV(collectionId);

  return {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: FUNCTION_NAME,
    functionArgs: [collectionIdCV],
    collectionId: collectionId,
  };
};

/**
 * Get the network API URL
 */
export const getNetworkApiUrl = (networkMode: 'testnet' | 'mainnet'): string => {
  if (networkMode === 'mainnet') {
    return 'https://api.mainnet.hiro.so';
  }
  return 'https://api.testnet.hiro.so';
};

/**
 * Exports contract configuration for use in other modules
 */
export const getContractConfig = () => ({
  address: import.meta.env.VITE_STACKS_CONTRACT_ADDRESS || 'ST16R99CR18X1A20JBV0N546BH07HGWMKBRTCRK90',
  name: import.meta.env.VITE_STACKS_CONTRACT_NAME || 'genstacks-fee',
  functionName: 'pay-for-collection-download',
});
