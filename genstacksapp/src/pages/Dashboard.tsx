// /genstacks/genstacksapp/src/pages/Dashboard.tsx (FINAL FIX)

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import React, { useState } from 'react';
import CollectionForm from '@/components/CollectionForm'; 

const Dashboard: React.FC = () => {
  // Use separate selectors for performance and debugging
  const isAuth = useAuthStore(state => state.isAuth);
  const userAddresses = useAuthStore(state => state.userAddresses);
  const logout = useAuthStore(state => state.logout);
  
  const [isGenerating, setIsGenerating] = useState(false);
  
  const stxAddress = userAddresses?.stxAddress;

  // --- RENDERING GUARDS ---

  // 1. If not authenticated or data is missing, redirect/show error
  if (!isAuth || !stxAddress) {
    // Note: In App.tsx, we already redirect to Landing if !isAuth.
    // This handles the async loading of the address data post-connect.
    return (
        <div className="p-8 text-center">
            <h3 className='text-xl'>Loading wallet data...</h3>
            <p className='text-gray-500'>If this persists, please try signing out and connecting again.</p>
        </div>
    );
  }
  
  // 2. If the user has started the form, render the form component
  if (isGenerating) {
    return <CollectionForm onCancel={() => setIsGenerating(false)} />;
  }

  // --- MAIN DASHBOARD CONTENT ---
  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="flex justify-between items-center pb-4 border-b">
        <h2 className="text-3xl font-bold">Welcome, Creator!</h2>
        <div className="flex items-center space-x-4">
          <span className="text-gray-500 truncate">
            Wallet: **{stxAddress.substring(0, 6)}...{stxAddress.slice(-4)}**
          </span>
          <Button variant="outline" onClick={logout}>Sign Out</Button>
        </div>
      </header>

      <div className="mt-8 text-center">
        <h3 className="text-2xl mb-4">Ready to generate your NFT collection?</h3>
        <Button 
          size="lg" 
          onClick={() => setIsGenerating(true)} 
          className="px-10 py-6 bg-green-500 hover:bg-green-600 text-white"
        >
          Get Started: Define Collection Parameters →
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;