# GENSTACKS: NFT Collection Generator (Stacks)

[![](https://img.shields.io/github/issues/POA200/Genstacks)](https://github.com/POA200/Genstacks/issues)
[![](https://img.shields.io/github/stars/POA200/Genstacks)](https://github.com/POA200/Genstacks/stargazers)
[![](https://img.shields.io/badge/Stacks-Blockchain-black?logo=stacks)](https://www.stacks.co/)

## 🚀 Overview

**GENSTACKS** is a decentralized application (dApp) designed to provide creators with a powerful, interactive tool to generate unique, rarity-controlled NFT collections. Built on the **Stacks Blockchain**, GENSTACKS utilizes a **Serverless Architecture** to handle high-performance image generation, preparing all necessary image assets and decentralized metadata for subsequent on-chain minting.

The current version (V1) focuses on secure, verifiable asset generation and collecting a service fee for the final download package.

## ✨ Key Features

- **Backend-less Architecture:** Zero traditional server, eliminating database and maintenance overhead. Generation runs on **Vercel Serverless Functions**.
- **High-Performance Generation:** Uses **Sharp.js** inside the serverless layer for lightning-fast, layered image composition.
- **Advanced Rarity Control:** Intuitive controls to set rarity weights/percentages for individual traits, including built-in **Collision and Exclusion** checks for guaranteed uniqueness and validity.
- **Real-Time Status Polling:** Provides a smooth UX using polling to track the progress of the long-running image generation job.
- **Decentralized Asset Preparation:** Automatically uploads and pins final generated NFT images and metadata (with IPFS CIDs) to **Pinata/IPFS**.
- **V1 Service Fee:** Utilizes the custom Clarity contract (`genstacks-fee.clar`) to process a verifiable **50 STX** service fee for asset download.

## 🛠️ Technology Stack (Serverless Architecture)

| Component          | Technology                           | Description                                                                           |
| :----------------- | :----------------------------------- | :------------------------------------------------------------------------------------ |
| **Frontend**       | `React`, `TypeScript`, `Shadcn UI`   | User interface, wallet integration (`Stacks.js`), and status polling.                  |
| **Compute/Backend**| `Vercel Serverless`, `Node.js`, `Sharp`| Executes image composition, rarity logic, and final Pinata upload. **No SQL required.** |
| **Data/Storage**   | `Pinata`, `IPFS/Arweave`             | Decentralized, permanent storage for both trait assets and final collections.             |
| **Blockchain**     | `Stacks`                             | The layer for transaction processing and future NFT minting (V2). |
| **Smart Contract** | `Clarity`                            | Logic for V1 fee collection (`genstacks-fee.clar`).                                    |

## 📦 Project Structure (Serverless Vercel)

```
genstacks-repo-name/
├── genstacksapp/              # Frontend (React/TS) - The dApp UI
│   ├── src/
│   │   ├── components/        # UI components (Shadcn)
│   │   ├── hooks/             # useGenerationStatus.ts (Polling)
│   ├── public/
│   ├── functions/             # Vercel Serverless Functions (The "Backend")
│   │   ├── generate.ts        # NFT Generation & Pinata Upload (Uses Sharp)
│   │   └── status.ts          # Status Read Endpoint (Polling)
├── contracts/                 # Clarity Smart Contracts
│   ├── genstacks-fee.clar     # V1: Fee Collection Logic
│   └── genstacks-nft-collection.clar # V2: Future NFT Minting Logic
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

- Node.js (LTS version)
- npm or yarn
- A Stacks Wallet (e.g., Xverse, Leather) for testing blockchain interactions.
- **A Pinata Account** for IPFS storage.
- **A Vercel Account** for deploying the Serverless functions.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/POA200/Genstacks.git
    cd Genstacks/genstacksapp
    ```

2.  **Install dependencies:** (Assuming a single monorepo structure for simplicity)
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the `genstacksapp` directory and populate it:

    - **Frontend (Public/Scoped Key):** `VITE_PINATA_JWT` (The scoped key for initial trait uploads)
    - **Backend (Private/Admin Key):** `PINATA_JWT_SERVERLESS` (The full-access key for final ZIP upload - **Set securely in Vercel**).
    - **Clarity Contract Details:** `VITE_FEE_CONTRACT_ADDRESS` (e.g., `ST1...`), `VITE_FEE_CONTRACT_NAME` (`genstacks-fee`).

### Running Locally

1.  **Start the Frontend & Serverless Functions (Via Vite/Vercel CLI):**

    ```bash
    npm run dev 
    # Vite will proxy serverless functions via Vercel CLI locally
    # Client should open on http://localhost:5173 
    ```

## 📜 Clarity Contracts

This dApp utilizes the `genstacks-fee.clar` contract to manage the service fee.

| Contract                        | Version          | Purpose                                                                                                                    |
| :------------------------------ | :--------------- | :------------------------------------------------------------------------------------------------------------------------- |
| `genstacks-fee.clar`            | **V1 (Current)** | Handles the 50 STX service fee payment for asset download, prevents double payment, and logs a verifiable event. |
| `genstacks-nft-collection.clar` | **V2 (Future)**  | Defines the Non-Fungible Token and integrates the fee into a single `mint` transaction.                                    |

## 📞 Contact

iPeter / Project Lead – ipeter1010x@gmail.com

Project Link: https://github.com/POA200/Genstacks
