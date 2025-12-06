// /genstacks/genstacksapp/src/components/form-steps/LayerUploadStep.tsx

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { useCollectionConfigStore } from "@/store/configStore";
import type { Layer } from "@/store/configStore";
import React, { useState, useRef } from "react";
import axios from "axios";
import { Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { pinFileOrDirectoryToPinata } from "@/utils/pinataUpload";

interface LayerUploadStepProps {
  onNext: () => void;
}

// ----------------------------------------------------------------------
// FIX: Combine environment variable fetching and fallback logic into a single constant.
// This resolves the TS6133 warning by removing the unused RENDER_API_URL variable.
const API_BASE_URL =
  import.meta.env.VITE_RENDER_API_URL || "http://localhost:10000/api";
// ----------------------------------------------------------------------

const LayerUploadStep: React.FC<LayerUploadStepProps> = ({ onNext }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null); // Dependencies
  const { collectionName, layers, setLayers } = useCollectionConfigStore();
  const stxAddress = useAuthStore((state) => state.userAddresses?.stxAddress); // --- Utility for moving layers up/down ---

  const handleMoveLayer = (layerId: string, direction: "up" | "down") => {
    // 1. Find the current layer's position (order value)
    const layerIndex = layers.findIndex((l) => l.id === layerId);
    if (layerIndex === -1) return;

    const layersSorted = [...layers].sort((a, b) => a.order - b.order);
    const targetIndex = direction === "up" ? layerIndex - 1 : layerIndex + 1; // Boundary check

    if (targetIndex < 0 || targetIndex >= layers.length) return; // Swap the order values of the current layer and the target layer

    const currentOrder = layersSorted[layerIndex].order;
    const targetOrder = layersSorted[targetIndex].order; // Perform the swap logic using setLayers action
    setLayers(
      layers
        .map((layer) => {
          if (layer.id === layerId) {
            return { ...layer, order: targetOrder };
          }
          if (layer.id === layersSorted[targetIndex].id) {
            return { ...layer, order: currentOrder };
          }
          return layer;
        })
        .sort((a, b) => a.order - b.order)
    ); // Re-sort immediately
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    if (!stxAddress) {
      setUploadError("Wallet not connected.");
      return;
    }

    // --- 1. Client-Side Validation and Grouping ---
    const layerMap = new Map<string, { files: File[]; order: number }>();
    const fileList = Array.from(files);

    fileList.forEach((file) => {
      const cleanPath = file.webkitRelativePath.replace(/^\/+/g, "");
      const parts = cleanPath.split("/").filter((p) => p !== "");
      if (parts.length < 2 || parts[parts.length - 1].startsWith(".")) return;
      let layerName = parts[0];
      const traitFileName = parts[parts.length - 1];

      if (parts.length > 2 && !parts[parts.length - 2].includes(".")) {
        layerName = parts[parts.length - 2];
      } else if (parts.length === 2 && !parts[1].includes(".")) {
        layerName = parts[0];
      } else if (parts.length > 1 && parts[parts.length - 1].includes(".")) {
        layerName = parts[0];
      } else {
        return;
      }

      if (!layerName || layerName.includes(".")) return;

      if (!layerMap.has(layerName)) {
        layerMap.set(layerName, { files: [], order: layerMap.size + 1 });
      }
      if (traitFileName) {
        layerMap.get(layerName)?.files.push(file);
      }
    });

    if (layerMap.size < 2) {
      setUploadError(
        "Collection must have at least two attribute folders. Please ensure your files are nested correctly (e.g., Folder/Layer1/trait.png, Folder/Layer2/trait.png)."
      );
      setIsUploading(false);
      return;
    }

    // Create the initial Layer array for the Zustand store
    const initialLayers: Layer[] = Array.from(layerMap.entries()).map(
      ([name, data]) => ({
        id: name.toLowerCase().replace(/\s/g, "-"),
        name: name,
        order: data.order,
        traits: data.files.map((file) => ({
          name: file.name,
          rarity: 100 / data.files.length,
        })),
      })
    );

    // --- 2. Direct Upload to Pinata (No Render Backend) ---
    setIsUploading(true);
    setUploadError(null);
    setUploadMessage("1/2: Uploading trait assets directly to Pinata...");

    try {
      // Construct FormData for Pinata with directory structure preserved
      const formData = new FormData();

      // Add all files with their full path (webkitRelativePath preserves folder structure)
      fileList.forEach((file) => {
        // Append file with webkitRelativePath as the key to preserve directory structure
        formData.append("file", file, file.webkitRelativePath);
      });

      // Add metadata for the collection
      const metadata = JSON.stringify({ 
        name: `${collectionName}-traits-${Date.now()}`,
        description: `Trait assets for ${collectionName}` 
      });
      formData.append("pinataMetadata", metadata);

      // 2a. Upload to Pinata
      setUploadMessage("2/2: Finalizing assets and generating IPFS references...");
      const result = await pinFileOrDirectoryToPinata(formData);

      console.log(`Trait assets uploaded to Pinata. IPFS Hash: ${result.IpfsHash}`);

      // 2b. Store the baseCid from Pinata response in each layer for future reference
      const layersWithCid = initialLayers.map((layer) => ({
        ...layer,
        traits: layer.traits.map((trait) => ({
          ...trait,
          // Store the IPFS path for each trait file
          assetId: `${result.IpfsHash}/${collectionName}/${layer.name}/${trait.name}`,
        })),
      }));

      setLayers(layersWithCid); // Store the detected layers
      setUploadMessage(
        "Upload complete! Layers detected, ordered, and ready for rarity configuration."
      );
    } catch (err) {
      console.error("Trait upload error:", err);
      setUploadError(
        err instanceof Error 
          ? `Upload Failed: ${err.message}` 
          : "Upload failed. Check your Pinata configuration and console logs."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
           {" "}
      <Card>
               {" "}
        <CardHeader>
                    <CardTitle>Layer and Trait Upload</CardTitle>         {" "}
          <CardDescription>
                        Select the folder containing your attribute layers.
            (e.g., /MyCollection $\rightarrow$ /Background, /Body).          {" "}
          </CardDescription>
                 {" "}
        </CardHeader>
               {" "}
        <CardContent className="space-y-4">
                   {" "}
          <Input
            ref={fileInputRef}
            type="file" // @ts-ignore
            webkitdirectory="true"
            directory=""
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
                             {" "}
          <div className="flex justify-center">
                       {" "}
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              size="lg"
            >
                           {" "}
              {isUploading ? (
                <>
                                   {" "}
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />             
                      {uploadMessage}               {" "}
                </>
              ) : (
                "Select Collection Folder"
              )}
                         {" "}
            </Button>
                     {" "}
          </div>
                   
          {uploadError && (
            <div className="text-red-500 text-sm text-center p-2 border border-red-500 rounded-md font-sans">
              Error: {uploadError}
            </div>
          )}
                   {" "}
          {/* Layer Ordering Display (Visible after successful upload) */}     
             {" "}
          {layers.length > 0 && (
            <div className="mt-6 p-4 border rounded-md shadow-inner">
                           {" "}
              <h4 className="font-bold text-lg mb-3">
                Layer Stacking Order (1 is Front)
              </h4>
                           {" "}
              <div className="flex flex-col space-y-2">
                               {" "}
                {layers
                  .sort((a, b) => a.order - b.order)
                  .map((layer, index) => (
                    <div
                      key={layer.id}
                      className={`flex items-center justify-between p-3 border rounded-md transition-all 
                        ${
                        index === 0
                          ? "bg-yellow-50 border-yellow-300"
                          : index === layers.length - 1
                          ? "bg-gray-100 border-gray-300"
                          : "bg-white"
                      }`}
                    >
                                           {" "}
                      <span className="font-semibold w-1/2">
                                                Layer **#{index + 1}:{" "}
                        {layer.name}**                      {" "}
                      </span>
                                           {" "}
                      <span className="text-sm text-gray-500 w-1/4 text-center">
                                                {layer.traits.length} Traits    
                                         {" "}
                      </span>
                                           {" "}
                      <div className="space-x-2">
                                               {" "}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveLayer(layer.id, "up")}
                          disabled={index === 0}
                          aria-label="Move layer up (to front)"
                        >
                                                   {" "}
                          <ArrowUp className="h-4 w-4" />                       {" "}
                        </Button>
                                               {" "}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveLayer(layer.id, "down")}
                          disabled={index === layers.length - 1}
                          aria-label="Move layer down (to back)"
                        >
                                                   {" "}
                          <ArrowDown className="h-4 w-4" />                     
                           {" "}
                        </Button>
                                             {" "}
                      </div>
                                         {" "}
                    </div>
                  ))}
                             {" "}
              </div>
                           {" "}
              <p className="text-xs text-right text-gray-400 mt-2">
                                Order: Top layer (1) is drawn last (on top).    
                         {" "}
              </p>
                         {" "}
            </div>
          )}
                 {" "}
        </CardContent>
               {" "}
        <CardFooter className="justify-end">
                   {" "}
          <Button
            onClick={onNext}
            disabled={layers.length === 0 || isUploading}
          >
                        Next: Set Rarity →          {" "}
          </Button>
                 {" "}
        </CardFooter>
             {" "}
      </Card>
         {" "}
    </div>
  );
};

export default LayerUploadStep;
