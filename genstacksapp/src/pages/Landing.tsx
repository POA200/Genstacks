// /genstacks/genstacksapp/src/pages/Landing.tsx (Refactored)
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import React from 'react';
import { Wallet } from 'lucide-react';

const Landing: React.FC = () => {
  const connectWallet = useAuthStore(state => state.connectWallet);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-6xl font-extrabold text-primary">
        GENSTACKS
      </h1>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        NFT Collection Generator
      </h2>
      <p className="text-md text-gray-600 mb-2">
        Connect your wallet to get started.
      </p>
      <Button 
        onClick={connectWallet} // Calls the function from the Zustand store
        className="cursor-pointer rounded-lg" size={'lg'}
      > <Wallet />
        Connect Stacks Wallet
      </Button>
    </div>
  );
};

export default Landing;