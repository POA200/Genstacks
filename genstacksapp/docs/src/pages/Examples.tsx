import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function Examples() {
  const userFlowSteps = [
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
  ];

  return (
    <div className="space-y-6 px-3 sm:px-5">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          User Flow
        </h1>
        <p className="text-lg text-muted-foreground font-sans">
          Follow the complete step-by-step process to create your NFT collection
        </p>
      </div>

      <Separator />

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Collection Generation Process
        </h2>
        <div className="space-y-4">
          {userFlowSteps.map((item) => (
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

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Smart Contract Integration
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>V1: Fee Collection Contract</CardTitle>
            <CardDescription>genstacks-fee.clar</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80 text-sm mb-4 font-sans">
              Fee collection contract that prevents the same collection ID from
              paying multiple times.
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
      </section>
    </div>
  );
}
