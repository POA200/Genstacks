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
  /** Controls whether the app should show the dashboard view (manual user navigation) */
  showDashboard: boolean;
  setShowDashboard: (v: boolean) => void;
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
  showDashboard: false,

  setShowDashboard: (v: boolean) => set({ showDashboard: v }),

  connectWallet: async () => {
    // If already connected, update store from local storage and return
    if (isConnected()) {
      console.log('Already authenticated. Updating store from local storage.');
      const local = getLocalStorage();
      const addresses = local?.addresses ? extractAddresses(local.addresses as Addresses) : null;
      set({ isAuth: true, userAddresses: addresses });
      return;
    }

    try {
      // Trigger the connect flow (popup / redirect handled by @stacks/connect)
      await connect();

      // After connect completes, read the updated local storage and update the store
      const local = getLocalStorage();
      const addresses = local?.addresses ? extractAddresses(local.addresses as Addresses) : null;
      set({ isAuth: isConnected(), userAddresses: addresses });

      // Note: removed automatic window.location.reload() so the app can react
      // to auth state changes through Zustand without forcing a full page reload.
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  },

  logout: () => {
    disconnect(); 
    set({ isAuth: false, userAddresses: null, showDashboard: false });
  },
}));