// /genstacks/genstacksapp/src/pages/Dashboard.tsx (FINAL FIX)

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import React, { useState } from "react";
import CollectionForm from "@/components/CollectionForm";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardFooter from "@/components/DashboardFooter";

const Dashboard: React.FC = () => {
  // Use separate selectors for performance and debugging
  const isAuth = useAuthStore((state) => state.isAuth);
  const userAddresses = useAuthStore((state) => state.userAddresses);
  const logout = useAuthStore((state) => state.logout);

  const [isGenerating, setIsGenerating] = useState(false);

  const stxAddress = userAddresses?.stxAddress;

  // --- RENDERING GUARDS ---

  // 1. If not authenticated or data is missing, redirect/show error
  if (!isAuth || !stxAddress) {
    // Note: In App.tsx, we already redirect to Landing if !isAuth.
    // This handles the async loading of the address data post-connect.
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl">Loading wallet data...</h3>
        <p className="text-muted-foreground font-sans">
          If this persists, please try signing out and connecting again.
        </p>
      </div>
    );
  }

  // 2. If the user has started the form, render the form component
  if (isGenerating) {
    return <CollectionForm onCancel={() => setIsGenerating(false)} />;
  }

  // --- MAIN DASHBOARD CONTENT ---
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader stxAddress={stxAddress} onLogout={logout} />

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
          <div className="text-center space-y-6 md:space-y-8">
            {/* Welcome Message */}
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-primary tracking-wide">
                Welcome Back!
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-foreground/80 font-medium font-sans">
                Ready to Create Something Amazing?
              </p>
            </div>

            {/* Description */}
            <div className="max-w-2xl mx-auto space-y-3 md:space-y-4">
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed font-sans">
                Generate unique NFT collections with our powerful tools. Upload
                your layers, configure rarity settings, and create thousands of
                unique combinations in minutes.
              </p>
              {/* CTA Button */}
              <div className="pt-6 md:pt-8">
                <Button
                  size="lg"
                  onClick={() => setIsGenerating(true)}
                  className="cursor-pointer rounded-lg text-lg md:text-xl lg:text-2xl px-6 md:px-8 py-4 md:py-6 transition-all duration-300 hover:scale-105 font-sans"
                >
                  Start Creating Your Collection →
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                      01
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <h3 className="font-semibold text-base md:text-lg">
                      Upload Layers
                    </h3>
                    <p className="text-sm text-muted-foreground font-sans">
                      Add your artwork and traits
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                      02
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <h3 className="font-semibold text-base md:text-lg">
                      Configure Rarity
                    </h3>
                    <p className="text-sm text-muted-foreground font-sans">
                      Set trait weights and rules
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                      03
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <h3 className="font-semibold text-base md:text-lg">
                      Generate Collection
                    </h3>
                    <p className="text-sm text-muted-foreground font-sans">
                      Create unique NFTs instantly
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
