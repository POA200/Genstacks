;; nft-fee-collector.clar
;; Implements the contract logic to receive a fixed fee for NFT generation.

;; ---------------------------------------------------------------------
;; CONSTANTS
;; ---------------------------------------------------------------------

;; The principal address that owns the fee revenue (Replace with your own Stacks address)
(define-constant contract-owner 'ST16R99CR18X1A20JBV0N546BH07HGWMKBRTCRK90)

;; The fee amount required: 50 STX (u50000000 micro-STX)
(define-constant FEE-AMOUNT u50000000)

;; Error codes
(define-constant ERR-TRANSFER-FAILED u101)

;; ---------------------------------------------------------------------
;; PUBLIC FUNCTIONS
;; ---------------------------------------------------------------------

;; @desc Receives the 50 STX fee and logs a verifiable event.
;; @param job-id - The unique ID string for the generation job (from the backend).
;; This function relies on a Stacks Post-Condition in the frontend transaction
;; to ensure the user sends exactly FEE-AMOUNT.

(define-public (pay-for-collection (job-id (string-ascii 64)))
  (begin
    ;; 1. Transfer the STX fee from the transaction sender to the contract owner.
    ;; The 'try!' will abort the entire transaction if the stx-transfer? fails 
    ;; (e.g., if the user lacks the STX balance).
    (try! (stx-transfer? FEE-AMOUNT tx-sender contract-owner))

    ;; 2. Log a unique event on the blockchain. 
    ;; The backend verifies the transaction by checking for this exact log.
    (ok (print {
      event: "fee_paid",
      job_id: job-id,
      amount: FEE-AMOUNT,
      sender: tx-sender,
    }))
  )
)

;; ---------------------------------------------------------------------
;; READ-ONLY FUNCTIONS (Optional: for testing)
;; ---------------------------------------------------------------------

(define-read-only (get-fee-amount)
  (ok FEE-AMOUNT)
)
