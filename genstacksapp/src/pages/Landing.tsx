// /genstacks/genstacksapp/src/pages/Landing.tsx (Refactored)
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import React from 'react';

const Landing: React.FC = () => {
  const connectWallet = useAuthStore(state => state.connectWallet);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-5xl font-extrabold text-blue-600 mb-4">
        NFT Collection Generator dApp
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Connect your wallet to get started.
      </p>
      <Button 
        onClick={connectWallet} // Calls the function from the Zustand store
        className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-lg shadow-xl"
      >
        Connect Stacks Wallet 🚀
      </Button>
    </div>
  );
};

export default Landing;