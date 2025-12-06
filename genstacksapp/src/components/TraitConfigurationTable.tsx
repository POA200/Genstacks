// src/components/TraitConfigurationTable.tsx

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { TraitVariant, TraitLayer } from "@/types/collection";

// Utility function: Recalculate rarity percentages based on weights
const recalculateRarities = (variants: TraitVariant[]): TraitVariant[] => {
  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);

  // If totalWeight is zero, prevent division by zero
  if (totalWeight === 0) {
    return variants.map((v) => ({ ...v, rarityPercent: 0, weight: v.weight }));
  }

  // Calculate the new percentage for each variant
  return variants.map((v) => ({
    ...v,
    rarityPercent: parseFloat(((v.weight / totalWeight) * 100).toFixed(4)),
    weight: v.weight, // Keep the weight value intact
  }));
};

interface TraitConfigurationTableProps {
  layer: TraitLayer;
  onUpdate: (updatedLayer: TraitLayer) => void;
}

const TraitConfigurationTable: React.FC<TraitConfigurationTableProps> = ({
  layer,
  onUpdate,
}) => {
  // Local state for traits, calculated upon mount or when the layer prop changes
  const [localVariants, setLocalVariants] = useState<TraitVariant[]>(
    recalculateRarities(layer.variants)
  );

  // Recalculate and update when the external layer object changes (e.g., when a new file is uploaded)
  useEffect(() => {
    setLocalVariants(recalculateRarities(layer.variants));
  }, [layer.variants]);

  const handleWeightChange = (index: number, newWeight: number) => {
    // 1. Update the weight in the specific trait
    const updatedVariants = localVariants.map((v, i) =>
      i === index ? { ...v, weight: newWeight } : v
    );

    // 2. Recalculate percentages across the whole layer
    const fullyUpdatedVariants = recalculateRarities(updatedVariants);

    // 3. Update local state
    setLocalVariants(fullyUpdatedVariants);

    // 4. Trigger the external update (to persist the change and update the Right Pane chart)
    const totalWeight = fullyUpdatedVariants.reduce(
      (sum, v) => sum + v.weight,
      0
    );
    onUpdate({
      ...layer,
      variants: fullyUpdatedVariants,
      totalWeight: totalWeight, // Update the total weight for the layer
    });
  };

  // Handler for deleting a trait
  const handleTraitDelete = (index: number) => {
    const afterDelete = localVariants.filter((_, i) => i !== index);
    const fullyUpdatedVariants = recalculateRarities(afterDelete);

    // Update local state
    setLocalVariants(fullyUpdatedVariants);

    // Calculate new total weight and trigger external update
    const totalWeight = fullyUpdatedVariants.reduce(
      (sum, v) => sum + v.weight,
      0
    );
    onUpdate({
      ...layer,
      variants: fullyUpdatedVariants,
      totalWeight: totalWeight,
    });
  };

  const totalWeight = localVariants.reduce((sum, v) => sum + v.weight, 0);

  return (
    <div className="bg-card p-4 rounded-lg shadow-inner">
      <h3 className="text-xl font-semibold text-primary mb-4">
        Configuring Traits for: {layer.name}
      </h3>

      {/* Total Weight Summary */}
      <div className="mb-4 p-2 bg-background border border-border rounded text-sm text-foreground">
        Total Layer Weight:{" "}
        <span className="font-bold text-accent">{totalWeight}</span>
      </div>

      <Table className="min-w-full">
        <TableHeader className="bg-primary/10">
          <TableRow>
            <TableHead className="w-[40%] text-foreground">
              Trait Name
            </TableHead>
            <TableHead className="w-[20%] text-center text-foreground">
              Weight (Input)
            </TableHead>
            <TableHead className="w-[25%] text-center text-foreground">
              Rarity (%)
            </TableHead>
            <TableHead className="w-[15%] text-center text-foreground">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localVariants.map((variant, index) => (
            <TableRow
              key={variant.name}
              className="hover:bg-primary/5 border-border"
            >
              <TableCell className="font-medium text-foreground">
                {variant.name}
              </TableCell>

              {/* Shadcn Input inside TableCell */}
              <TableCell className="text-center">
                <Input
                  type="number"
                  value={variant.weight}
                  onChange={(e) =>
                    handleWeightChange(index, parseInt(e.target.value) || 0)
                  }
                  className="w-full bg-background border-primary/50 text-center text-foreground"
                  min={0}
                />
              </TableCell>

              {/* Rarity Display (Immediate Feedback) */}
              <TableCell className="text-center font-mono">
                <span
                  className={
                    variant.rarityPercent < 1
                      ? "text-destructive"
                      : "text-accent"
                  }
                >
                  {variant.rarityPercent}%
                </span>
              </TableCell>

              {/* Delete Button */}
              <TableCell className="text-center">
                <Button
                  onClick={() => handleTraitDelete(index)}
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TraitConfigurationTable;
