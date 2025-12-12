import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function Introduction() {
  return (
    <div className="space-y-6 px-3 sm:px-5">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          GENSTACKS Documentation
        </h1>
        <p className="text-lg text-muted-foreground font-sans">
          Decentralized NFT Collection Generator on Stacks Blockchain
        </p>
      </div>

      <Separator />

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Overview
        </h2>
        <p className="leading-7 font-sans">
          GENSTACKS is a decentralized application (dApp) designed to allow
          users to create and generate their own NFT collections. The platform
          leverages <strong>Vercel Serverless Functions</strong> for all
          computation, making it highly scalable, cost-efficient, and
          eliminating the need for a traditional backend database. The entire
          process is verifiable via the Stacks Blockchain.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Core Functionality
        </h2>
        <ul className="ml-6 list-disc space-y-3 font-sans">
          <li>Connect wallet (e.g., Leather, Xverse)</li>
          <li>Create and customize NFT collection</li>
          <li>Upload traits/attributes to Pinata/IPFS</li>
          <li>Set rarity percentages, exclusion rules, and collision limits</li>
          <li>Pay 50 STX fee via Clarity contract</li>
          <li>Trigger serverless generation and download final assets</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Version Information
        </h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-base py-2 px-4">
            Version 1.0
          </Badge>
          <span className="text-sm text-muted-foreground font-sans">
            Current Release
          </span>
        </div>
      </section>
    </div>
  );
}
