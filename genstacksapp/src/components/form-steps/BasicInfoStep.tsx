// /genstacks/genstacksapp/src/components/form-steps/BasicInfoStep.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCollectionConfigStore } from "@/store/configStore";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface BasicInfoStepProps {
  onNext: () => void;
}

// 1. Define Zod Schema for validation
const formSchema = z.object({
  collectionName: z
    .string()
    .min(3, { message: "Name must be at least 3 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  supply: z.coerce
    .number()
    .min(100, { message: "Minimum supply is 100." })
    .max(10000, { message: "Maximum supply is 10,000." }),
});

type FormValues = z.infer<typeof formSchema>;

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ onNext }) => {
  // Pull state and action from the Zustand store
  const { collectionName, description, supply, setBasicInfo } =
    useCollectionConfigStore();

  // 2. Initialize React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collectionName: collectionName,
      description: description,
      // Supply is number in store, but form field is string
      supply: supply,
    },
  });

  // 3. Define the submission handler
  const onSubmit = (values: FormValues) => {
    // Save validated data to the Zustand store
    setBasicInfo(values.collectionName, values.description, values.supply);
    onNext(); // Proceed to the next step
  };

  return (
    // Use the form.handleSubmit from react-hook-form for validation before onSubmit
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
      {/* Collection Name Field */}
      <div className="space-y-2">
        <Label htmlFor="collectionName" className="font-sans">
          Collection Name
        </Label>
        <Input
          id="collectionName"
          {...form.register("collectionName")}
          placeholder="e.g., Bitcoin Apes"
          className="font-sans"
        />
        {form.formState.errors.collectionName && (
          <p className="text-sm text-red-500 font-sans">
            {form.formState.errors.collectionName.message}
          </p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description" className="font-sans">
          Description
        </Label>
        <Input
          id="description"
          {...form.register("description")}
          placeholder="A brief summary of your NFT project."
          className="font-sans"
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-500 font-sans">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      {/* Supply Field */}
      <div className="space-y-2">
        <Label htmlFor="supply" className="font-sans">
          Total Supply (100 - 10,000)
        </Label>
        <Input
          id="supply"
          type="number"
          {...form.register("supply", { valueAsNumber: true })}
          placeholder="e.g., 5000"
          className="font-sans"
        />
        {form.formState.errors.supply && (
          <p className="text-sm text-red-500 font-sans">
            {form.formState.errors.supply.message}
          </p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit">Next: Upload Layers →</Button>
      </div>
    </form>
  );
};

export default BasicInfoStep;
