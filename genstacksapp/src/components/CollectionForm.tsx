// /genstacks/genstacksapp/src/components/CollectionForm.tsx

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BasicInfoStep from '@/components/form-steps/BasicInfoStep'; 
import LayerUploadStep from '@/components/form-steps/LayerUploadStep'; // <-- IMPORTED
import { useCollectionConfigStore } from '@/store/configStore';

interface CollectionFormProps {
  onCancel: () => void;
}

const CollectionForm: React.FC<CollectionFormProps> = ({ onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4; // Basic Info, File Upload, Rarity, Preview/Payment

  // Used for conditional disabling of the Finalize button
  const isRarityConfigured = useCollectionConfigStore(state => state.isRarityConfigured);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

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
        return <div>Step 3: Rarity Configuration (WIP)</div>;
      case 4:
        // Step 4: Preview & Payment (WIP)
        return <div>Step 4: Preview & Payment (WIP)</div>;
      default:
        return <div>Unknown Step</div>;
    }
  };

  // Functionality for the Finalize & Generate button click
  const handleFinalize = () => {
      // TODO: This function will trigger the final Render API call to start the generation worker thread.
      console.log('--- FINALIZING GENERATION JOB ---');
      console.log('Sending job to Render backend...');
      // Placeholder for actual API call
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Collection Generation Wizard</span>
            <span className="text-base font-medium text-gray-500">
              Step {currentStep} of {totalSteps}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
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
                disabled={!isRarityConfigured} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                Finalize & Generate
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CollectionForm;