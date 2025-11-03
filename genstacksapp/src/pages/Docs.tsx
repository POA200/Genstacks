import React from 'react';
import Footer from '@/components/Footer';
import Logo from '@/assets/Genstacks.png';
import { Button } from '@/components/ui/button';

const Docs: React.FC = () => {
  const handleReturn = () => {
    if (typeof window !== 'undefined') {
      // Always navigate back to the landing page (main site home)
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-background">

      <main className="max-w-5xl mx-auto px-6 py-20 font-sans">
        {/* Return button */}
        <div className="mb-8">
          <Button
            onClick={handleReturn}
            aria-label="Return to landing page"
            className="text-primary flex items-center gap-2 rounded-lg px-4 py-2 text-sm md:text-base lg:text-lg"
            variant="link"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span className="hidden sm:inline">Return to Home</span>
          </Button>
        </div>

        {/* Documentation Header with Logo */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <img src={Logo} alt="GENSTACKS Logo" className="h-24 w-auto" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">GENSTACKS Documentation</h1>
          <p className="text-lg text-foreground/80">Version 1.0</p>
        </div>

        {/* Overview Section */}
        <section className="mb-16" id="overview">
          <h2 className="text-2xl font-bold text-foreground mb-6">1. Overview</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-foreground/80 mb-6">
              GENSTACKS is a decentralized application (dApp) designed to allow users to create and generate their own NFT collections. 
              The app provides a simple and interactive interface that guides users through the process of uploading, customizing, 
              and generating unique NFTs based on their traits and preferences. The platform is built on the Stacks Blockchain.
            </p>
            
            <h3 className="text-xl font-semibold mb-4">Core Functionality:</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Connect wallet (e.g., Leather, Xverse)</li>
              <li>Create and customize NFT collection</li>
              <li>Upload traits/attributes for NFTs</li>
              <li>Set rarity percentages for each trait</li>
              <li>Generate NFTs and preview them</li>
              <li>Pay 50 STX to license and download final NFT images and metadata (ready for external minting)</li>
            </ul>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="mb-16" id="features">
          <h2 className="text-2xl font-bold text-foreground mb-6">2. Key Features</h2>
          <div className="space-y-6 text-foreground/80">
            <div>
              <h3 className="text-xl font-semibold mb-3">Wallet Integration</h3>
              <p>Users connect their Stacks wallets (Leather, Xverse) to interact with the dApp.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">NFT Collection Creation</h3>
              <p>Users define the name, description, and size (100 to 10,000 NFTs) of their collection.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Trait Upload & Customization</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Users upload folders containing subfolders of image assets representing various NFT traits (e.g., background, body, clothes).</li>
                <li>Users arrange the traits in the order they should be stacked and set rarity percentages to control their appearance frequency.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">NFT Generation & Preview</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>The backend randomly generates NFTs based on user input using a cryptographically secure pseudo-random number generator (CSPRNG).</li>
                <li>Users can preview the generated NFTs before proceeding to payment and download.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Metadata & Image Download</h3>
              <p>Users pay a 50 STX fee to license and download the generated NFTs and their corresponding metadata. This fee covers computation, generation, and decentralized asset preparation.</p>
            </div>
          </div>
        </section>

        {/* Architecture Section */}
        <section className="mb-16" id="architecture">
          <h2 className="text-2xl font-bold text-foreground mb-6">3. Architecture</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Frontend</h3>
              <div className="bg-secondary/20 rounded-lg p-6">
                <p className="font-semibold mb-2">Technology Stack:</p>
                <p className="text-foreground/80 mb-4">React, TypeScript, TailwindCSS</p>
                <p className="font-semibold mb-2">Features:</p>
                <p className="text-foreground/80">Wallet connection UI (using Stacks.js), input forms, drag-and-drop trait arrangement, preview gallery, and payment gateway integration.</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Backend</h3>
              <div className="bg-secondary/20 rounded-lg p-6">
                <p className="font-semibold mb-2">Technology Stack:</p>
                <p className="text-foreground/80 mb-4">Node.js, Express, PostgreSQL, IPFS/Arweave</p>
                <p className="font-semibold mb-2">Features:</p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>Handle trait uploads and store temporary user data in PostgreSQL</li>
                  <li>Perform random NFT generation and metadata creation</li>
                  <li>Manage decentralized storage via IPFS/Arweave</li>
                  <li>Handle API endpoints and verify payments</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Blockchain (Stacks)</h3>
              <div className="bg-secondary/20 rounded-lg p-6">
                <p className="font-semibold mb-2">Technology Stack:</p>
                <p className="text-foreground/80 mb-4">Stacks Blockchain, Clarity Smart Contracts</p>
                <p className="font-semibold mb-2">Current Functionality (V1):</p>
                <p className="text-foreground/80 mb-4">50 STX payment via simple STX transfer (non-refundable service and licensing fee)</p>
                <p className="font-semibold mb-2">Future Functionality (V2):</p>
                <p className="text-foreground/80">Full on-chain NFT minting via V2 Smart Contract</p>
              </div>
            </div>
          </div>
        </section>

        {/* User Flow Section */}
        <section className="mb-16" id="user-flow">
          <h2 className="text-2xl font-bold text-foreground mb-6">4. User Flow</h2>
          <div className="space-y-4 text-foreground/80">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 rounded-full px-3 py-1 text-sm font-semibold">Step 1</div>
              <p><span className="font-semibold">Connect Wallet:</span> Users connect their Stacks wallet (Leather, Xverse)</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 rounded-full px-3 py-1 text-sm font-semibold">Step 2</div>
              <p><span className="font-semibold">Create NFT Collection:</span> Define Collection Name, Description, and number of NFTs (100 to 10,000)</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 rounded-full px-3 py-1 text-sm font-semibold">Step 3</div>
              <p><span className="font-semibold">Upload Traits:</span> Upload folders containing image assets for different traits</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 rounded-full px-3 py-1 text-sm font-semibold">Step 4</div>
              <p><span className="font-semibold">Arrange & Set Rarity:</span> Order traits and adjust rarity percentages</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 rounded-full px-3 py-1 text-sm font-semibold">Step 5</div>
              <p><span className="font-semibold">Generate NFTs:</span> System randomizes traits and prepares final files</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 rounded-full px-3 py-1 text-sm font-semibold">Step 6</div>
              <p><span className="font-semibold">Preview NFTs:</span> Review the generated collection</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 rounded-full px-3 py-1 text-sm font-semibold">Step 7</div>
              <p><span className="font-semibold">Pay & Download:</span> Pay 50 STX fee and download generated files</p>
            </div>
          </div>
        </section>

        {/* Smart Contract Examples Section */}
        <section className="mb-16" id="contracts">
          <h2 className="text-2xl font-bold text-foreground mb-6">5. Smart Contract Examples</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">V1: Fee Collection Contract (Current)</h3>
              <p className="text-foreground/80 mb-4">
                This contract is used for the current service fee collection. It requires a frontend Post-Condition 
                to ensure the user sends the exact FEE-AMOUNT.
              </p>
              <div className="bg-card border-2 border-primary rounded-lg p-6 overflow-x-auto">
                <pre className="text-sm text-foreground/90">
                  <code>{`;; nft-fee-collector.clar
;; Implements the contract logic to receive a fixed fee for file licensing.

;; Fee details (50 STX)
(define-constant contract-owner 'SP2BWNDQ6FFHCRGRP1VCAXHSMYTDY8J8T075AZV4Q)
(define-constant FEE-AMOUNT u50000000) ;; 50 STX in micro-STX

;; @desc Receives the 50 STX fee and logs a verifiable event.
(define-public (pay-for-collection (job-id (string-ascii 64)))
  (begin
    ;; Transfer STX fee from sender to contract owner
    (try! (stx-transfer? FEE-AMOUNT tx-sender contract-owner))

    ;; Log a unique event for backend verification
    (ok (print { 
        event: "fee_paid", 
        job_id: job-id,
        amount: FEE-AMOUNT,
        sender: tx-sender 
    }))
  )
)`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">V2: NFT Minting Contract (Future)</h3>
              <p className="text-foreground/80 mb-4">
                This contract will handle on-chain NFT creation. The 50 STX fee collection is integrated 
                directly into the mint function.
              </p>
              <div className="bg-card border-2 border-primary rounded-lg p-6 overflow-x-auto">
                <pre className="text-sm text-foreground/90">
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
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Future Features Section */}
        <section className="mb-16" id="future">
          <h2 className="text-2xl font-bold text-foreground mb-6">6. Future Features</h2>
          <ul className="list-disc pl-6 space-y-3 text-foreground/80">
            <li><span className="font-semibold">Minting:</span> The ability to mint NFTs directly on-chain via the V2 contract</li>
            <li><span className="font-semibold">Marketplace Integration:</span> Allow users to list, buy, and sell NFTs directly from the platform</li>
            <li><span className="font-semibold">Advanced Trait Control:</span> Allow users to upload different file types (audio, video) for multimedia NFTs</li>
            <li><span className="font-semibold">Referral System:</span> Reward users who refer others to create NFT collections</li>
          </ul>
        </section>

        {/* Conclusion Section */}
        <section className="mb-16" id="conclusion">
          <h2 className="text-2xl font-bold text-foreground mb-6">7. Conclusion</h2>
          <p className="text-foreground/80">
            GENSTACKS will provide users with a seamless, interactive, and fully decentralized platform to create, 
            customize, and download NFT collections. By combining the power of Stacks Blockchain and Clarity Smart 
            Contracts, users retain full ownership and control over their generated digital assets. Minting will be 
            implemented in a future version of the platform.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Docs;
