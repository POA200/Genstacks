// /genstacks/genstacksapp/src/components/form-steps/RarityConfigStep.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCollectionConfigStore } from '@/store/configStore';
import type { Layer } from '@/store/configStore'; // Need the 'type' import
import React, { useState, useEffect } from 'react';

interface RarityConfigStepProps {
  onNext: () => void;
}

const RarityConfigStep: React.FC<RarityConfigStepProps> = ({ onNext }) => {
  // Get global state and actions
  const { layers, updateTraitRarity } = useCollectionConfigStore();
  
  // Local state to track errors and input changes
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [canProceed, setCanProceed] = useState(false);

  // Deep clone layers from Zustand to use as local state for input changes. 
  // This prevents unnecessary global re-renders on every keystroke.
  const [localLayers, setLocalLayers] = useState<Layer[]>(JSON.parse(JSON.stringify(layers)));
  
  // --- CORE VALIDATION LOGIC ---
  useEffect(() => {
    let allValid = true;
    const newErrors: Record<string, string | null> = {};

    localLayers.forEach(layer => {
      // Calculate the sum of all trait rarities in the current layer
      const totalRarity = layer.traits.reduce((sum, trait) => sum + (trait.rarity || 0), 0);
      
      // Validation: Check if the total is exactly 100% (with a small tolerance for float issues)
      if (Math.abs(totalRarity - 100) > 0.001) { 
        newErrors[layer.id] = `Total must be 100%. Current: ${totalRarity.toFixed(2)}%`;
        allValid = false;
      } else {
        newErrors[layer.id] = null;
      }
    });

    setErrors(newErrors);
    setCanProceed(allValid);
  }, [localLayers]);

  // --- INPUT CHANGE HANDLER ---
  const handleRarityChange = (layerId: string, traitName: string, value: string) => {
    // Parse the input value as a float
    const rarity = parseFloat(value);
    
    // Update the local state's layer structure
    setLocalLayers(prevLayers => 
      prevLayers.map(layer => {
        if (layer.id === layerId) {
          return {
            ...layer,
            traits: layer.traits.map(trait => 
              trait.name === traitName 
                ? { ...trait, rarity: isNaN(rarity) ? 0 : rarity } 
                : trait
            ),
          };
        }
        return layer;
      })
    );
  };
  
  // --- FINAL SUBMISSION HANDLER ---
  const handleSubmit = () => {
    if (!canProceed) return;
    
    // Crucial: Save the final, validated configuration back to the global store
    localLayers.forEach(layer => {
        layer.traits.forEach(trait => {
            updateTraitRarity(layer.id, trait.name, trait.rarity);
        });
    });

    onNext(); // Proceed to the final step (Step 4)
  };

  if (layers.length === 0) {
    return <div className="text-center text-red-500">Error: No layers found. Please go back to Step 2 and upload files.</div>
  }

  return (
    <div className="space-y-6 p-4">
      <CardHeader className="p-0 pb-4">
        <CardTitle>Define Trait Rarity</CardTitle>
        <CardDescription>
          Set the appearance percentage for every trait within its layer. **Each layer's total must equal 100%.**
        </CardDescription>
      </CardHeader>

      <div className="space-y-8">
        {localLayers.map(layer => (
          <Card key={layer.id} className={errors[layer.id] ? "border-red-400" : "border-blue-200"}>
            <CardHeader className={errors[layer.id] ? "bg-red-50 py-3" : "bg-blue-50 py-3"}>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Layer: **{layer.name}**</span>
                {errors[layer.id] && (
                  <span className="text-sm text-red-600 font-normal">{errors[layer.id]}</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {layer.traits.map(trait => (
                <div key={trait.name} className="space-y-1">
                  <Label htmlFor={`${layer.id}-${trait.name}`} className="text-xs truncate block">
                    {/* Display trait name without file extension for cleaner UI */}
                    {trait.name.substring(0, trait.name.lastIndexOf('.')) || trait.name}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id={`${layer.id}-${trait.name}`}
                      type="number"
                      // Default to 0 or current rarity
                      value={trait.rarity} 
                      min="0"
                      max="100"
                      step="0.01"
                      onChange={(e) => handleRarityChange(layer.id, trait.name, e.target.value)}
                      className="w-full text-center"
                    />
                    <span className="text-lg">%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSubmit} 
          disabled={!canProceed}
          className={canProceed ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}
        >
          {canProceed ? 'Next: Preview & Generate →' : 'Fix Rarities to Continue'}
        </Button>
      </div>
    </div>
  );
};

export default RarityConfigStep;