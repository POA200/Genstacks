// Docs.tsx (The entire file, updated)

import React from "react";
import Footer from "@/components/Footer";
import Logo from "@/assets/Genstacks.png";
import { Button } from "@/components/ui/button";

const Docs: React.FC = () => {
  const handleReturn = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-background">
           {" "}
      <main className="max-w-5xl mx-auto px-6 py-20 font-sans">
                {/* Return button */}       {" "}
        <div className="mb-8">
                   {" "}
          <Button
            onClick={handleReturn}
            aria-label="Return to landing page"
            className="text-primary flex items-center gap-2 rounded-lg px-4 py-2 text-sm md:text-base lg:text-lg"
            variant="link"
          >
                       {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />           {" "}
            </svg>
                        <span className="hidden sm:inline">Return to Home</span>
                     {" "}
          </Button>
                 {" "}
        </div>
                {/* Documentation Header with Logo */}       {" "}
        <div className="mb-16">
                   {" "}
          <div className="flex items-center gap-4 mb-8">
                       {" "}
            <img src={Logo} alt="GENSTACKS Logo" className="h-24 w-auto" />     
               {" "}
          </div>
                   {" "}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            GENSTACKS Documentation
          </h1>
                   {" "}
          <p className="text-lg text-foreground/80">
            Version 1.0 (Serverless Architecture)
          </p>
                 {" "}
        </div>
                {/* Overview Section */}       {" "}
        <section className="mb-16" id="overview">
                   {" "}
          <h2 className="text-2xl font-bold text-foreground mb-6">
            1. Overview
          </h2>
                   {" "}
          <div className="prose prose-invert max-w-none">
                       {" "}
            <p className="text-foreground/80 mb-6">
                            GENSTACKS is a decentralized application (dApp)
              designed to allow users to create and generate their own NFT
              collections.               The platform leverages **Vercel
              Serverless Functions** for all computation, making it highly
              scalable, cost-efficient,               and eliminating the need
              for a traditional backend database. The entire process is
              verifiable via the Stacks Blockchain.            {" "}
            </p>
                                   {" "}
            <h3 className="text-xl font-semibold mb-4">Core Functionality:</h3> 
                     {" "}
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>Connect wallet (e.g., Leather, Xverse)</li>     
                      <li>Create and customize NFT collection</li>             {" "}
              <li>Upload traits/attributes to Pinata/IPFS</li>             {" "}
              <li>
                Set rarity percentages, exclusion rules, and collision limits.
              </li>
                            <li>Pay 50 STX (fee) via Clarity contract.</li>     
                     {" "}
              <li>
                Trigger **Serverless** generation and download final assets.
              </li>
                         {" "}
            </ul>
                     {" "}
          </div>
                 {" "}
        </section>
                {/* Key Features Section (Updated) */}       {" "}
        <section className="mb-16" id="features">
                   {" "}
          <h2 className="text-2xl font-bold text-foreground mb-6">
            2. Key Features
          </h2>
                   {" "}
          <div className="space-y-6 text-foreground/80">
                       {" "}
            <div>
                           {" "}
              <h3 className="text-xl font-semibold mb-3">
                Serverless Generation Engine
              </h3>
                           {" "}
              <p>
                NFT composition is executed entirely on **Vercel Serverless
                Functions** using **Sharp.js** for high-speed, parallel image
                rendering, ensuring low latency and high scalability.
              </p>
                         {" "}
            </div>
                       {" "}
            <div>
                           {" "}
              <h3 className="text-xl font-semibold mb-3">
                Robust Rarity Control
              </h3>
                           {" "}
              <ul className="list-disc pl-6 space-y-2">
                               {" "}
                <li>
                  Features built-in **Collision Handling** (Max Retries) to
                  prevent infinite loops.
                </li>
                               {" "}
                <li>
                  Enforces user-defined **Exclusion Rules** (e.g., Hat A cannot
                  be with Hair B).
                </li>
                             {" "}
              </ul>
                         {" "}
            </div>
                       {" "}
            <div>
                           {" "}
              <h3 className="text-xl font-semibold mb-3">
                Real-Time Status & UX
              </h3>
                           {" "}
              <p>
                Utilizes a polling mechanism and **Shadcn UI** components to
                give users a live progress bar and status updates while the
                collection is being generated in the serverless environment.
              </p>
                         {" "}
            </div>
                       {" "}
            <div>
                           {" "}
              <h3 className="text-xl font-semibold mb-3">
                Metadata & Image Download
              </h3>
                           {" "}
              <p>
                Users pay a 50 STX fee via a **Clarity contract call** to
                license and download the final collection ZIP (images and
                metadata), which is hosted on Pinata/IPFS.
              </p>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </section>
                {/* Architecture Section (Updated) */}       {" "}
        <section className="mb-16" id="architecture">
                   {" "}
          <h2 className="text-2xl font-bold text-foreground mb-6">
            3. Architecture
          </h2>
                   {" "}
          <div className="space-y-8">
                       {" "}
            <div>
                           {" "}
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Frontend
              </h3>
                           {" "}
              <div className="bg-secondary/20 rounded-lg p-6">
                               {" "}
                <p className="font-semibold mb-2">Technology Stack:</p>         
                     {" "}
                <p className="text-foreground/80 mb-4">
                  React, TypeScript, TailwindCSS, **Shadcn UI**
                </p>
                                <p className="font-semibold mb-2">Features:</p> 
                             {" "}
                <p className="text-foreground/80">
                  Wallet connection, trait arrangement (drag-and-drop),
                  real-time rarity calculation table, and status polling
                  interface.
                </p>
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <div>
                           {" "}
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Compute Layer (Serverless)
              </h3>
                           {" "}
              <div className="bg-secondary/20 rounded-lg p-6">
                               {" "}
                <p className="font-semibold mb-2">Technology Stack:</p>         
                     {" "}
                <p className="text-foreground/80 mb-4">
                  **Vercel Serverless Functions**, Node.js, **Sharp.js**,
                  **JSZip**
                </p>
                                <p className="font-semibold mb-2">Functions:</p>
                               {" "}
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                                   {" "}
                  <li>
                    `/api/generate`: Executes image composition, rarity
                    selection, and final Pinata upload.
                  </li>
                                   {" "}
                  <li>
                    `/api/status`: Provides the current job progress for
                    frontend polling.
                  </li>
                                 {" "}
                </ul>
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <div>
                           {" "}
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Blockchain (Stacks)
              </h3>
                           {" "}
              <div className="bg-secondary/20 rounded-lg p-6">
                               {" "}
                <p className="font-semibold mb-2">Technology Stack:</p>         
                     {" "}
                <p className="text-foreground/80 mb-4">
                  Stacks Blockchain, Clarity Smart Contracts
                </p>
                               {" "}
                <p className="font-semibold mb-2">
                  Current Functionality (V1):
                </p>
                               {" "}
                <p className="text-foreground/80 mb-4">
                  50 STX payment via verifiable contract call
                  (`pay-for-collection-download`) that tracks the job ID.
                </p>
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </section>
                {/* User Flow Section (Minor Update) */}       {" "}
        <section className="mb-16" id="user-flow">
                   {" "}
          <h2 className="text-2xl font-bold text-foreground mb-6">
            4. User Flow
          </h2>
                   {" "}
          <div className="space-y-4 text-foreground/80">
                       {" "}
            <div className="flex items-start gap-4">
                           {" "}
              <div className="bg-primary/20 rounded-full px-3 py-1 text-sm font-semibold">
                Step 1
              </div>
                           {" "}
              <p>
                <span className="font-semibold">Connect Wallet:</span> Users
                connect their Stacks wallet (Leather, Xverse)
              </p>
                         {" "}
            </div>
                       {" "}
            <div className="flex items-start gap-4">
                           {" "}
              <div className="bg-primary/20 rounded-full px-3 py-1 text-sm font-semibold">
                Step 2
              </div>
                           {" "}
              <p>
                <span className="font-semibold">Create NFT Collection:</span>{" "}
                Define Collection Name, Description, and size (up to 10,000
                NFTs)
              </p>
                         {" "}
            </div>
                       {" "}
            <div className="flex items-start gap-4">
                           {" "}
              <div className="bg-primary/20 rounded-full px-3 py-1 text-sm font-semibold">
                Step 3
              </div>
                           {" "}
              <p>
                <span className="font-semibold">Upload Traits:</span> Upload
                image assets for different traits to Pinata/IPFS using a scoped
                key.
              </p>
                         {" "}
            </div>
                       {" "}
            <div className="flex items-start gap-4">
                           {" "}
              <div className="bg-primary/20 rounded-full px-3 py-1 text-sm font-semibold">
                Step 4
              </div>
                           {" "}
              <p>
                <span className="font-semibold">Arrange & Set Rarity:</span>{" "}
                Order traits, set rarity weights, and define exclusion rules in
                the interactive table.
              </p>
                         {" "}
            </div>
                       {" "}
            <div className="flex items-start gap-4">
                           {" "}
              <div className="bg-primary/20 rounded-full px-3 py-1 text-sm font-semibold">
                Step 5
              </div>
                           {" "}
              <p>
                <span className="font-semibold">Pay 50 STX Fee:</span> Execute
                the `pay-for-collection-download` contract call via Stacks
                Wallet.
              </p>
                         {" "}
            </div>
                       {" "}
            <div className="flex items-start gap-4">
                           {" "}
              <div className="bg-primary/20 rounded-full px-3 py-1 text-sm font-semibold">
                Step 6
              </div>
                           {" "}
              <p>
                <span className="font-semibold">Serverless Generation:</span>{" "}
                Frontend triggers `/api/generate`. The computation starts, and
                the UI displays the live status.
              </p>
                         {" "}
            </div>
                       {" "}
            <div className="flex items-start gap-4">
                           {" "}
              <div className="bg-primary/20 rounded-full px-3 py-1 text-sm font-semibold">
                Step 7
              </div>
                           {" "}
              <p>
                <span className="font-semibold">Download Final Assets:</span>{" "}
                Once complete, download the final ZIP file (images and metadata)
                from the final Pinata CID.
              </p>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </section>
                {/* Smart Contract Examples Section (Updated) */}       {" "}
        <section className="mb-16" id="contracts">
                   {" "}
          <h2 className="text-2xl font-bold text-foreground mb-6">
            5. Smart Contract Examples
          </h2>
                             {" "}
          <div className="space-y-8">
                       {" "}
            <div>
                           {" "}
              <h3 className="text-xl font-semibold mb-4">
                V1: Fee Collection Contract (`genstacks-fee.clar`)
              </h3>
                           {" "}
              <p className="text-foreground/80 mb-4">
                                This contract is used for the current service
                fee collection. It includes a map to prevent the same collection
                ID from paying the fee multiple times.              {" "}
              </p>
                           {" "}
              <div className="bg-card border-2 border-primary rounded-lg p-6 overflow-x-auto">
                               {" "}
                <pre className="text-sm text-foreground/90">
                                   {" "}
                  <code>{`;; genstacks-fee.clar
;; Implements the contract logic to receive a fixed fee for file licensing.

(define-constant DEVELOPER-ADDRESS 'SP2BWNDQ6FFHCRGRP1VCAXHSMYTDY8J8T075AZV4Q) 
(define-constant FEE-AMOUNT u50000000) ;; 50 STX in micro-STX
(define-constant ERR-ALREADY-PAID u101)

;; Map to track which collection ID has already paid
(define-map collection-paid 
    { collection-id: (string-ascii 64) } 
    bool
)

;; The main public function the user calls.
(define-public (pay-for-collection-download (collection-id (string-ascii 64)))
    (begin
        ;; Check if this collection ID has already paid
        (asserts! 
            (is-none (map-get? collection-paid {collection-id: collection-id})) 
            ERR-ALREADY-PAID
        )

        ;; Attempt to transfer the STX 
        (unwrap-err! (stx-transfer? 
            FEE-AMOUNT 
            tx-sender 
            DEVELOPER-ADDRESS) 
            (err u100)
        )

        ;; Record the successful payment
        (map-set collection-paid {collection-id: collection-id} true)

        (ok true)
    )
)`}</code>
                                 {" "}
                </pre>
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <div>
                           {" "}
              <h3 className="text-xl font-semibold mb-4">
                V2: NFT Minting Contract (Future)
              </h3>
                           {" "}
              <p className="text-foreground/80 mb-4">
                                This contract will handle on-chain NFT creation.
                The 50 STX fee collection is integrated                 directly
                into the mint function. (Code remains unchanged as this is
                future scope).              {" "}
              </p>
                           {" "}
              <div className="bg-card border-2 border-primary rounded-lg p-6 overflow-x-auto">
                               {" "}
                <pre className="text-sm text-foreground/90">
                                   {" "}
                  <code>{`;; genstacks-nft-collection.clar
;; Defines the NFT and integrates the platform fee into the mint function.

(define-constant NFT-NAME "GENSTACKS Collection")
(define-constant NFT-SYMBOL "GENSTACKS")
(define-constant FEE-RECIPIENT 'SP2BWNDQ6FFHCRGRP1VCAXHSMYTDY8J8T075AZV4Q)
(define-constant MINT-FEE u50000000) ;; 50 STX fee

(define-non-fungible-token nft-token uint)
(define-data-var last-token-id uint u0)
(define-map token-uri { token-id: uint } { uri: (string-utf8 256) })

;; Mint function (future)
(define-public (mint (recipient principal) (uri (string-utf8 256)))
  (let ((new-id (+ (var-get last-token-id) u1)))
    (begin
      
      ;; 1. Collect the 50 STX platform fee
      (try! (stx-transfer? MINT-FEE tx-sender FEE-RECIPIENT))
      
      ;; 2. Mint the NFT
      (var-set last-token-id new-id)
      (map-set token-uri { token-id: new-id } { uri: uri })
      (unwrap! (nft-mint? nft-token new-id recipient) (err u100))
      
      (ok new-id))))

;; Transfer function (optional)
(define-public (transfer (id uint) (sender principal) (recipient principal))
  (unwrap! (nft-transfer? nft-token id sender recipient) (err u1))
  (ok true))`}</code>
                                 {" "}
                </pre>
                           {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </section>
                {/* Future Features Section */}       {" "}
        <section className="mb-16" id="future">
                   {" "}
          <h2 className="text-2xl font-bold text-foreground mb-6">
            6. Future Features
          </h2>
                   {" "}
          <ul className="list-disc pl-6 space-y-3 text-foreground/80">
                       {" "}
            <li>
              <span className="font-semibold">Minting:</span> The ability to
              mint NFTs directly on-chain via the V2 contract
            </li>
                       {" "}
            <li>
              <span className="font-semibold">Marketplace Integration:</span>{" "}
              Allow users to list, buy, and sell NFTs directly from the platform
            </li>
                       {" "}
            <li>
              <span className="font-semibold">Advanced Trait Control:</span>{" "}
              Allow users to upload different file types (audio, video) for
              multimedia NFTs
            </li>
                     {" "}
          </ul>
                 {" "}
        </section>
                {/* Conclusion Section */}       {" "}
        <section className="mb-16" id="conclusion">
                   {" "}
          <h2 className="text-2xl font-bold text-foreground mb-6">
            7. Conclusion
          </h2>
                   {" "}
          <p className="text-foreground/80">
                        GENSTACKS will provide users with a seamless,
            interactive, and fully decentralized platform to create,            
            customize, and download NFT collections. By combining the power of
            the Stacks Blockchain and Serverless             Architecture, users
            retain full ownership and control over their generated digital
            assets.          {" "}
          </p>
                 {" "}
        </section>
             {" "}
      </main>
            <Footer />   {" "}
    </div>
  );
};

export default Docs;
