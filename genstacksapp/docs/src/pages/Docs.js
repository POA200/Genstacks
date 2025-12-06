import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
const DocsPage = () => {
    const sections = [
        { id: "overview", title: "1. Overview" },
        { id: "features", title: "2. Key Features" },
        { id: "architecture", title: "3. Architecture" },
        { id: "user-flow", title: "4. User Flow" },
        { id: "contracts", title: "5. Smart Contract Examples" },
        { id: "future", title: "6. Future Features" },
        { id: "conclusion", title: "7. Conclusion" },
    ];
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("main", { className: "max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20", children: [_jsxs("div", { className: "mb-16 text-center", children: [_jsx("div", { className: "flex justify-center mb-8", children: _jsx("h1", { className: "text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground", children: "GENSTACKS" }) }), _jsx("h1", { className: "text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4", children: "Documentation" }), _jsx("p", { className: "text-lg text-foreground/60 mb-6 font-sans", children: "Decentralized NFT Collection Generator on Stacks Blockchain" }), _jsx(Badge, { variant: "outline", className: "text-base py-2 px-4", children: "Version 1.0 (Serverless Architecture)" })] }), _jsxs(Card, { className: "mb-12", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Table of Contents" }) }), _jsx(CardContent, { children: _jsx("nav", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: sections.map((section) => (_jsx("a", { href: `#${section.id}`, className: "text-primary hover:underline transition-all font-sans", children: section.title }, section.id))) }) })] }), _jsxs("section", { className: "mb-16", id: "overview", children: [_jsx("h2", { className: "text-3xl font-bold text-foreground mb-6", children: "1. Overview" }), _jsx(Card, { children: _jsxs(CardContent, { className: "pt-6", children: [_jsxs("p", { className: "text-foreground/80 mb-6 leading-relaxed font-sans", children: ["GENSTACKS is a decentralized application (dApp) designed to allow users to create and generate their own NFT collections. The platform leverages", " ", _jsx("strong", { children: "Vercel Serverless Functions" }), " for all computation, making it highly scalable, cost-efficient, and eliminating the need for a traditional backend database. The entire process is verifiable via the Stacks Blockchain."] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4 text-foreground", children: "Core Functionality:" }), _jsxs("ul", { className: "space-y-2 text-foreground/80 font-sans", children: [_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-primary font-bold mt-1", children: "\u2022" }), "Connect wallet (e.g., Leather, Xverse)"] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-primary font-bold mt-1", children: "\u2022" }), "Create and customize NFT collection"] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-primary font-bold mt-1", children: "\u2022" }), "Upload traits/attributes to Pinata/IPFS"] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-primary font-bold mt-1", children: "\u2022" }), "Set rarity percentages, exclusion rules, and collision limits"] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-primary font-bold mt-1", children: "\u2022" }), "Pay 50 STX fee via Clarity contract"] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-primary font-bold mt-1", children: "\u2022" }), "Trigger serverless generation and download final assets"] })] })] })] }) })] }), _jsxs("section", { className: "mb-16", id: "features", children: [_jsx("h2", { className: "text-3xl font-bold text-foreground mb-6", children: "2. Key Features" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Serverless Generation Engine" }) }), _jsx(CardContent, { children: _jsxs("p", { className: "text-foreground/80 font-sans", children: ["NFT composition is executed entirely on", " ", _jsx("strong", { children: "Vercel Serverless Functions" }), " using", " ", _jsx("strong", { children: "Sharp.js" }), " for high-speed, parallel image rendering, ensuring low latency and high scalability."] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Robust Rarity Control" }) }), _jsx(CardContent, { children: _jsxs("ul", { className: "space-y-2 text-foreground/80 text-sm font-sans", children: [_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-primary font-bold mt-1", children: "\u2022" }), _jsxs("span", { children: [_jsx("strong", { children: "Collision Handling" }), " (Max Retries) to prevent infinite loops"] })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-primary font-bold mt-1", children: "\u2022" }), _jsxs("span", { children: ["Enforces user-defined ", _jsx("strong", { children: "Exclusion Rules" })] })] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Real-Time Status & UX" }) }), _jsx(CardContent, { children: _jsxs("p", { className: "text-foreground/80 font-sans", children: ["Utilizes a polling mechanism and ", _jsx("strong", { children: "Shadcn UI" }), " ", "components to give users a live progress bar and status updates while the collection is being generated."] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Metadata & Image Download" }) }), _jsx(CardContent, { children: _jsxs("p", { className: "text-foreground/80 font-sans", children: ["Users pay a 50 STX fee via a", " ", _jsx("strong", { children: "Clarity contract call" }), " to license and download the final collection ZIP, hosted on Pinata/IPFS."] }) })] })] })] }), _jsxs("section", { className: "mb-16", id: "architecture", children: [_jsx("h2", { className: "text-3xl font-bold text-foreground mb-6", children: "3. Architecture" }), _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-lg", children: "Frontend" }), _jsx(CardDescription, { children: "Technology Stack" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-foreground mb-2", children: "Stack:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: ["React", "TypeScript", "TailwindCSS", "Shadcn UI"].map((tech) => (_jsx(Badge, { variant: "secondary", children: tech }, tech))) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-foreground mb-2", children: "Features:" }), _jsx("p", { className: "text-foreground/80 text-sm font-sans", children: "Wallet connection, trait arrangement, real-time rarity calculation table, and status polling interface." })] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-lg", children: "Compute Layer (Serverless)" }), _jsx(CardDescription, { children: "Vercel Serverless Functions" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-foreground mb-2", children: "Stack:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: ["Vercel Functions", "Node.js", "Sharp.js", "JSZip"].map((tech) => (_jsx(Badge, { variant: "secondary", children: tech }, tech))) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-foreground mb-2", children: "APIs:" }), _jsxs("ul", { className: "space-y-2 text-foreground/80 text-sm font-sans", children: [_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-primary font-bold mt-1", children: "\u2022" }), _jsxs("span", { children: [_jsx("code", { className: "bg-secondary px-2 py-1 rounded", children: "/api/generate" }), " ", "- Executes image composition and uploads to Pinata"] })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-primary font-bold mt-1", children: "\u2022" }), _jsxs("span", { children: [_jsx("code", { className: "bg-secondary px-2 py-1 rounded", children: "/api/status" }), " ", "- Provides current job progress"] })] })] })] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-lg", children: "Blockchain Layer" }), _jsx(CardDescription, { children: "Stacks Blockchain" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-foreground mb-2", children: "Stack:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: ["Stacks Blockchain", "Clarity Smart Contracts"].map((tech) => (_jsx(Badge, { variant: "secondary", children: tech }, tech))) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-foreground mb-2", children: "Current Functionality (V1):" }), _jsx("p", { className: "text-foreground/80 text-sm font-sans", children: "50 STX payment via verifiable contract call that tracks the job ID and prevents duplicate payments." })] })] })] })] })] }), _jsxs("section", { className: "mb-16", id: "user-flow", children: [_jsx("h2", { className: "text-3xl font-bold text-foreground mb-6", children: "4. User Flow" }), _jsx("div", { className: "space-y-4", children: [
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
                            ].map((item) => (_jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "flex items-center justify-center h-10 w-10 rounded-full bg-primary/20", children: _jsx("span", { className: "text-primary font-bold", children: item.step }) }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-semibold text-foreground", children: item.title }), _jsx("p", { className: "text-foreground/60 text-sm mt-1 font-sans", children: item.desc })] })] }) }) }, item.step))) })] }), _jsxs("section", { className: "mb-16", id: "contracts", children: [_jsx("h2", { className: "text-3xl font-bold text-foreground mb-6", children: "5. Smart Contract Examples" }), _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "V1: Fee Collection Contract" }), _jsx(CardDescription, { children: "genstacks-fee.clar" })] }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-foreground/80 text-sm mb-4 font-sans", children: "Fee collection contract that prevents the same collection ID from paying multiple times." }), _jsx("div", { className: "bg-secondary/50 rounded-lg p-4 overflow-x-auto border border-primary/20", children: _jsx("pre", { className: "text-xs text-foreground/80 font-mono whitespace-pre-wrap break-words", children: `;; genstacks-fee.clar
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
)` }) })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "V2: NFT Minting Contract (Future)" }), _jsx(CardDescription, { children: "genstacks-nft-collection.clar" })] }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-foreground/80 text-sm mb-4 font-sans", children: "Future contract for on-chain NFT creation with integrated fee collection." }), _jsx("div", { className: "bg-secondary/50 rounded-lg p-4 overflow-x-auto border border-primary/20", children: _jsx("pre", { className: "text-xs text-foreground/80 font-mono whitespace-pre-wrap break-words", children: `;; genstacks-nft-collection.clar
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
)` }) })] })] })] })] }), _jsxs("section", { className: "mb-16", id: "future", children: [_jsx("h2", { className: "text-3xl font-bold text-foreground mb-6", children: "6. Future Features" }), _jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("ul", { className: "space-y-3", children: [_jsxs("li", { className: "flex items-start gap-3", children: [_jsx("span", { className: "text-primary font-bold text-lg mt-1", children: "\u2192" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground", children: "Minting" }), _jsx("p", { className: "text-foreground/60 text-sm font-sans", children: "Mint NFTs directly on-chain via the V2 contract" })] })] }), _jsxs("li", { className: "flex items-start gap-3", children: [_jsx("span", { className: "text-primary font-bold text-lg mt-1", children: "\u2192" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground", children: "Marketplace Integration" }), _jsx("p", { className: "text-foreground/60 text-sm font-sans", children: "List, buy, and sell NFTs directly from the platform" })] })] }), _jsxs("li", { className: "flex items-start gap-3", children: [_jsx("span", { className: "text-primary font-bold text-lg mt-1", children: "\u2192" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground", children: "Advanced Trait Control" }), _jsx("p", { className: "text-foreground/60 text-sm font-sans", children: "Support audio, video, and other multimedia file types" })] })] })] }) }) })] }), _jsxs("section", { className: "mb-16", id: "conclusion", children: [_jsx("h2", { className: "text-3xl font-bold text-foreground mb-6", children: "7. Conclusion" }), _jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsx("p", { className: "text-foreground/80 leading-relaxed font-sans", children: "GENSTACKS provides users with a seamless, interactive, and fully decentralized platform to create, customize, and download NFT collections. By combining the power of the Stacks Blockchain and Serverless Architecture, users retain full ownership and control over their generated digital assets." }) }) })] })] }) }));
};
export default DocsPage;
