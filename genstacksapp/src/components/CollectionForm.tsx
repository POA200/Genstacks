// /genstacks/genstacksapp/src/components/CollectionForm.tsx

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BasicInfoStep from "@/components/form-steps/BasicInfoStep";
import LayerUploadStep from "@/components/form-steps/LayerUploadStep";
import RarityConfigStep from "@/components/form-steps/RarityConfigStep";
import GenerationStatusStep from "@/components/form-steps/GenerationStatusStep";
import { useCollectionConfigStore } from "@/store/configStore";
import { useAuthStore } from "@/store/authStore";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardFooter from "@/components/DashboardFooter";

interface CollectionFormProps {
  onCancel: () => void;
}

const CollectionForm: React.FC<CollectionFormProps> = ({ onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4; // Basic Info, File Upload, Rarity, Preview/Payment

  // Used for conditional disabling of the Finalize button
  const isRarityConfigured = useCollectionConfigStore(
    (state) => state.isRarityConfigured
  );

  // Get user data for header
  const userAddresses = useAuthStore((state) => state.userAddresses);
  const logout = useAuthStore((state) => state.logout);
  const stxAddress = userAddresses?.stxAddress || "";

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        // Step 1: Basic Collection Info
        return <BasicInfoStep onNext={nextStep} />;
      case 2:
        // **FIXED**: Render the LayerUploadStep component
        return <LayerUploadStep onNext={nextStep} />;
      case 3:
        // Step 3: Rarity Configuration (WIP)
        return <RarityConfigStep onNext={nextStep} />;
      case 4:
        // Step 4: Preview & Payment (WIP)
        return <GenerationStatusStep onCancel={onCancel} />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  // Functionality for the Finalize & Generate button click
  const handleFinalize = () => {
    nextStep();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader stxAddress={stxAddress} onLogout={logout} />
      <div className="flex-1">
        <div className="max-w-4xl mx-auto py-12 px-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Collection Generation Wizard</span>
                <span className="text-base font-medium text-gray-500">
                  Step {currentStep} of {totalSteps}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>{renderStep()}</CardContent>
            <CardFooter className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <div className="space-x-4">
                {currentStep > 1 && (
                  <Button onClick={prevStep} variant="secondary">
                    ← Back
                  </Button>
                )}

                {currentStep === totalSteps && (
                  <Button
                    onClick={handleFinalize}
                    disabled={!isRarityConfigured} // Stays disabled until Step 3 is valid
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Finalize & Generate
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <DashboardFooter />
    </div>
  );
};
export default CollectionForm;
