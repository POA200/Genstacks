import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DocsPage: React.FC = () => {
  const sections = [
    { id: "overview", title: "1. Overview" },
    { id: "features", title: "2. Key Features" },
    { id: "architecture", title: "3. Architecture" },
    { id: "user-flow", title: "4. User Flow" },
    { id: "contracts", title: "5. Smart Contract Examples" },
    { id: "future", title: "6. Future Features" },
    { id: "conclusion", title: "7. Conclusion" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <div className="flex justify-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
              GENSTACKS
            </h1>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Documentation
          </h1>
          <p className="text-lg text-foreground/60 mb-6 font-sans">
            Decentralized NFT Collection Generator on Stacks Blockchain
          </p>
          <Badge variant="outline" className="text-base py-2 px-4">
            Version 1.0 (Serverless Architecture)
          </Badge>
        </div>

        {/* Table of Contents */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Table of Contents</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-primary hover:underline transition-all font-sans"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Overview Section */}
        <section className="mb-16" id="overview">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            1. Overview
          </h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-foreground/80 mb-6 leading-relaxed font-sans">
                GENSTACKS is a decentralized application (dApp) designed to
                allow users to create and generate their own NFT collections.
                The platform leverages{" "}
                <strong>Vercel Serverless Functions</strong> for all
                computation, making it highly scalable, cost-efficient, and
                eliminating the need for a traditional backend database. The
                entire process is verifiable via the Stacks Blockchain.
              </p>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Core Functionality:
                </h3>
                <ul className="space-y-2 text-foreground/80 font-sans">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-1">•</span>
                    Connect wallet (e.g., Leather, Xverse)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-1">•</span>
                    Create and customize NFT collection
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-1">•</span>
                    Upload traits/attributes to Pinata/IPFS
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-1">•</span>
                    Set rarity percentages, exclusion rules, and collision
                    limits
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-1">•</span>
                    Pay 50 STX fee via Clarity contract
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-1">•</span>
                    Trigger serverless generation and download final assets
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Key Features Section */}
        <section className="mb-16" id="features">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            2. Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Serverless Generation Engine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 font-sans">
                  NFT composition is executed entirely on{" "}
                  <strong>Vercel Serverless Functions</strong> using{" "}
                  <strong>Sharp.js</strong> for high-speed, parallel image
                  rendering, ensuring low latency and high scalability.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Robust Rarity Control</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-foreground/80 text-sm font-sans">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>
                      <strong>Collision Handling</strong> (Max Retries) to
                      prevent infinite loops
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>
                      Enforces user-defined <strong>Exclusion Rules</strong>
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Real-Time Status & UX</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 font-sans">
                  Utilizes a polling mechanism and <strong>Shadcn UI</strong>{" "}
                  components to give users a live progress bar and status
                  updates while the collection is being generated.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Metadata & Image Download
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 font-sans">
                  Users pay a 50 STX fee via a{" "}
                  <strong>Clarity contract call</strong> to license and download
                  the final collection ZIP, hosted on Pinata/IPFS.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Architecture Section */}
        <section className="mb-16" id="architecture">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            3. Architecture
          </h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Frontend</CardTitle>
                <CardDescription>Technology Stack</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    Stack:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["React", "TypeScript", "TailwindCSS", "Shadcn UI"].map(
                      (tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    Features:
                  </p>
                  <p className="text-foreground/80 text-sm font-sans">
                    Wallet connection, trait arrangement, real-time rarity
                    calculation table, and status polling interface.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Compute Layer (Serverless)
                </CardTitle>
                <CardDescription>Vercel Serverless Functions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    Stack:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Vercel Functions", "Node.js", "Sharp.js", "JSZip"].map(
                      (tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    APIs:
                  </p>
                  <ul className="space-y-2 text-foreground/80 text-sm font-sans">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span>
                        <code className="bg-secondary px-2 py-1 rounded">
                          /api/generate
                        </code>{" "}
                        - Executes image composition and uploads to Pinata
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span>
                        <code className="bg-secondary px-2 py-1 rounded">
                          /api/status
                        </code>{" "}
                        - Provides current job progress
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Blockchain Layer</CardTitle>
                <CardDescription>Stacks Blockchain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    Stack:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Stacks Blockchain", "Clarity Smart Contracts"].map(
                      (tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    Current Functionality (V1):
                  </p>
                  <p className="text-foreground/80 text-sm font-sans">
                    50 STX payment via verifiable contract call that tracks the
                    job ID and prevents duplicate payments.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* User Flow Section */}
        <section className="mb-16" id="user-flow">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            4. User Flow
          </h2>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Connect Wallet",
                desc: "Users connect their Stacks wallet (Leather, Xverse)",
              },
              {
                step: 2,
                title: "Create NFT Collection",
                desc: "Define Collection Name, Description, and size (up to 10,000 NFTs)",
              },
              {
                step: 3,
                title: "Upload Traits",
                desc: "Upload image assets for different traits to Pinata/IPFS",
              },
              {
                step: 4,
                title: "Arrange & Set Rarity",
                desc: "Order traits, set rarity weights, and define exclusion rules",
              },
              {
                step: 5,
                title: "Pay 50 STX Fee",
                desc: "Execute the payment contract call via Stacks Wallet",
              },
              {
                step: 6,
                title: "Serverless Generation",
                desc: "Frontend triggers generation. UI displays live status",
              },
              {
                step: 7,
                title: "Download Final Assets",
                desc: "Download the final ZIP file (images and metadata) from Pinata",
              },
            ].map((item) => (
              <Card key={item.step}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/20">
                        <span className="text-primary font-bold">
                          {item.step}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="text-foreground/60 text-sm mt-1 font-sans">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Smart Contracts Section */}
        <section className="mb-16" id="contracts">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            5. Smart Contract Examples
          </h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>V1: Fee Collection Contract</CardTitle>
                <CardDescription>genstacks-fee.clar</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 text-sm mb-4 font-sans">
                  Fee collection contract that prevents the same collection ID
                  from paying multiple times.
                </p>
                <div className="bg-secondary/50 rounded-lg p-4 overflow-x-auto border border-primary/20">
                  <pre className="text-xs text-foreground/80 font-mono whitespace-pre-wrap break-words">
                    {`;; genstacks-fee.clar
(define-constant DEVELOPER-ADDRESS 'SP2BWNDQ6FFHCRGRP1VCAXHSMYTDY8J8T075AZV4Q)
(define-constant FEE-AMOUNT u50000000)
(define-constant ERR-ALREADY-PAID u101)

(define-map collection-paid 
  { collection-id: (string-ascii 64) } 
  bool
)

(define-public (pay-for-collection-download (collection-id (string-ascii 64)))
  (begin
    (asserts! 
      (is-none (map-get? collection-paid {collection-id: collection-id})) 
      ERR-ALREADY-PAID
    )
    (unwrap-err! (stx-transfer? FEE-AMOUNT tx-sender DEVELOPER-ADDRESS) (err u100))
    (map-set collection-paid {collection-id: collection-id} true)
    (ok true)
  )
)`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>V2: NFT Minting Contract (Future)</CardTitle>
                <CardDescription>genstacks-nft-collection.clar</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 text-sm mb-4 font-sans">
                  Future contract for on-chain NFT creation with integrated fee
                  collection.
                </p>
                <div className="bg-secondary/50 rounded-lg p-4 overflow-x-auto border border-primary/20">
                  <pre className="text-xs text-foreground/80 font-mono whitespace-pre-wrap break-words">
                    {`;; genstacks-nft-collection.clar
(define-constant NFT-NAME "GENSTACKS Collection")
(define-constant FEE-RECIPIENT 'SP2BWNDQ6FFHCRGRP1VCAXHSMYTDY8J8T075AZV4Q)
(define-constant MINT-FEE u50000000)

(define-non-fungible-token nft-token uint)
(define-data-var last-token-id uint u0)

(define-public (mint (recipient principal) (uri (string-utf8 256)))
  (let ((new-id (+ (var-get last-token-id) u1)))
    (begin
      (try! (stx-transfer? MINT-FEE tx-sender FEE-RECIPIENT))
      (var-set last-token-id new-id)
      (unwrap! (nft-mint? nft-token new-id recipient) (err u100))
      (ok new-id)
    )
  )
)`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Future Features Section */}
        <section className="mb-16" id="future">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            6. Future Features
          </h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold text-lg mt-1">→</span>
                  <div>
                    <p className="font-semibold text-foreground">Minting</p>
                    <p className="text-foreground/60 text-sm font-sans">
                      Mint NFTs directly on-chain via the V2 contract
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold text-lg mt-1">→</span>
                  <div>
                    <p className="font-semibold text-foreground">
                      Marketplace Integration
                    </p>
                    <p className="text-foreground/60 text-sm font-sans">
                      List, buy, and sell NFTs directly from the platform
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold text-lg mt-1">→</span>
                  <div>
                    <p className="font-semibold text-foreground">
                      Advanced Trait Control
                    </p>
                    <p className="text-foreground/60 text-sm font-sans">
                      Support audio, video, and other multimedia file types
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Conclusion Section */}
        <section className="mb-16" id="conclusion">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            7. Conclusion
          </h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-foreground/80 leading-relaxed font-sans">
                GENSTACKS provides users with a seamless, interactive, and fully
                decentralized platform to create, customize, and download NFT
                collections. By combining the power of the Stacks Blockchain and
                Serverless Architecture, users retain full ownership and control
                over their generated digital assets.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default DocsPage;
