// /genstacks/genstacksapp/src/store/authStore.ts (FIXED TYPE EXPORT)

import { create } from 'zustand';
import { 
  connect, 
  disconnect, 
  isConnected, 
  getLocalStorage
} from '@stacks/connect';

// -------------------------------------------------------------------------
// FIX: Define the Addresses type structure based on what getLocalStorage returns.
// This avoids the 'no exported member' error.
interface StacksAddressInfo {
    address: string;
    publicKey: string;
}

interface Addresses {
    stx: StacksAddressInfo[];
    btc: StacksAddressInfo[];
}
// -------------------------------------------------------------------------


// --- Type Definitions ---
interface UserAddresses {
  stxAddress: string;
  btcAddress: string;
}

interface AuthState {
  isAuth: boolean;
  userAddresses: UserAddresses | null;
  connectWallet: () => Promise<void>;
  logout: () => void;
}

// --- Utility Function to Safely Extract Addresses ---
const extractAddresses = (addresses: Addresses): UserAddresses => {
  // Use optional chaining for safety in case the array is empty
  const stxAddress = addresses.stx[0]?.address || '';
  const btcAddress = addresses.btc[0]?.address || '';
  return { stxAddress, btcAddress };
};

// --- Initial State Logic ---
const localStorageData = getLocalStorage();

const initialAddresses = isConnected() && localStorageData?.addresses
  // We assert the type here now that we've defined it above
  ? extractAddresses(localStorageData.addresses as Addresses) 
  : null;

// --- Zustand Store ---
export const useAuthStore = create<AuthState>((set) => ({
  isAuth: isConnected(),
  userAddresses: initialAddresses,

  connectWallet: async () => {
    if (isConnected()) {
      console.log('Already authenticated. Skipping connect call.');
      return;
    }
    
    try {
      await connect(); 
      // Refresh to reload App.tsx and re-run initial state logic 
      window.location.reload(); 

    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  },

  logout: () => {
    disconnect(); 
    set({ isAuth: false, userAddresses: null });
    window.location.reload();
  },
}));