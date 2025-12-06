// src/components/GenerationStatusCard.tsx

import React, { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useGenerationStatus } from "@/hooks/useGenerationStatus";

interface GenerationStatusCardProps {
  collectionId: string;
}

const GenerationStatusCard: React.FC<GenerationStatusCardProps> = ({
  collectionId,
}) => {
  const { status, isLoading } = useGenerationStatus(collectionId);

  // Trigger toast on completion/failure
  useEffect(() => {
    if (status?.status === "COMPLETE") {
      toast.success("🚀 Generation Complete!", {
        description: "Your collection is ready for download.",
      });
    } else if (status?.status === "FAILED") {
      toast.error("🚨 Generation Failed", {
        description:
          status.errorMessage ||
          "An unexpected error occurred during processing.",
      });
    }
  }, [status?.status]);

  if (isLoading) {
    return <p className="text-purple-400">Loading job status...</p>;
  }

  if (!status) {
    return <p className="text-red-500">Job not found or connection lost.</p>;
  }

  const isComplete = status.status === "COMPLETE";
  const isFailed = status.status === "FAILED";
  const progressValue = isFailed ? 0 : status.progressPercent;

  // Dynamically choose the main color based on status
  const statusClass = isComplete
    ? "text-green-400"
    : isFailed
    ? "text-red-500"
    : "text-purple-400";

  return (
    <Card className="w-full max-w-lg bg-gray-900 border-purple-600/30 shadow-2xl shadow-purple-900/50">
      <CardHeader>
        <CardTitle className="text-2xl text-white">
          Processing:{" "}
          {isComplete ? "Completed" : isFailed ? "Error" : status.status}
        </CardTitle>
        <CardDescription className={statusClass}>
          {status.status === "GENERATING"
            ? `Generating Image ${status.currentImage} of ${status.totalImages}...`
            : isComplete
            ? "Files are ready for download."
            : status.errorMessage}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between items-center text-lg font-mono">
          <span className={statusClass}>{progressValue}%</span>
          <span className="text-gray-400">
            {status.currentImage}/{status.totalImages}
          </span>
        </div>
        {/* Shadcn Progress Component */}
        <Progress
          value={progressValue}
          className={`h-3 ${
            isComplete
              ? "bg-green-600"
              : isFailed
              ? "bg-red-600"
              : "bg-purple-600"
          }`}
        />
      </CardContent>
      {isComplete && (
        <CardFooter>
          <Button
            onClick={() =>
              window.open(
                `https://ipfs.io/ipfs/${status.finalDownloadCID}`,
                "_blank"
              )
            }
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            size="lg"
          >
            ⬇️ Download Collection (.zip)
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default GenerationStatusCard;
