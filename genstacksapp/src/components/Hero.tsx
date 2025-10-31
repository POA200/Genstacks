import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import React from 'react';
import { cn } from "@/lib/utils";
import HeroImg from './public/Heroimg.png';

const Hero: React.FC = () => {
  const connectWallet = useAuthStore(state => state.connectWallet);
  const isAuth = useAuthStore(state => state.isAuth);
  const setShowDashboard = useAuthStore(state => state.setShowDashboard);
  const logout = useAuthStore(state => state.logout);

  const handleButtonClick = () => {
    if (isAuth) {
      // When already authenticated, set the flag so App will render the Dashboard
      setShowDashboard(true);
      return;
    }

    // Otherwise initiate the wallet connect flow
    connectWallet();
  };

  return (
    <>
    <div className={cn(
      "min-h-screen antialiased relative"
    )}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-no-repeat"
        style={{
          backgroundImage: `url(${HeroImg})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          objectFit: 'cover',
        }}
      />
      
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-background/20 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center min-h-screen p-4 md:p-6 lg:p-8">
        <Badge
          className="text-sm md:text-md lg:text-lg px-2 md:px-3 lg:px-4 mb-4 tracking-wider text-foreground text-center bg-primary/20 backdrop-blur-sm border-2 border-primary "
          variant={'outline'}
        >
          {isAuth
            ? 'Your stacks wallet is connected'
            : 'Connect your stacks wallet to get started'
          }
        </Badge>
      <h1 className="text-5xl md:text-7xl lg:text-9xl mb-2 md:mb-3 lg:mb-4 font-extrabold text-primary tracking-wider text-center">
        GENSTACKS
      </h1>
      <h2 className="text-2xl md:text-3xl lg:text-5xl font-medium text-foreground mb-6 md:mb-8 lg:mb-10 tracking-wider text-center">
        NFT Collection Generator
      </h2>
      <Button 
        onClick={handleButtonClick}
        className="cursor-pointer rounded-lg tracking-wider text-lg md:text-2xl lg:text-3xl p-4 md:p-6 lg:p-8 transition-all duration-300 hover:scale-105 mb-2 md:mb-2 lg:mb-2" 
        size={'lg'}
      >
        {isAuth ? 'Continue to Dashboard' : 'Connect Wallet'}
      </Button>
      {isAuth && (
        <Button
          variant="outline"
          onClick={logout}
          className="cursor-pointer rounded-lg tracking-wider text-lg md:text-2xl lg:text-3xl p-4 md:p-6 lg:p-8 transition-all duration-300 hover:scale-105"
        >
          Disconnect Wallet
        </Button>
      )}
      </div>
    </div>
    </>
  );
};

export default Hero;