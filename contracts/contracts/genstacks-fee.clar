;; 
;; Title: GENSTACKS Fixed Fee Payment Contract
;; Description: Handles the transfer of a fixed fee (50 STX) from the caller to the deployer.
;;

(define-constant DEVELOPER-ADDRESS 'ST16R99CR18X1A20JBV0N546BH07HGWMKBRTCRK90)
;; IMPORTANT: Replace 'ST16R99CR18X1A20JBV0N546BH07HGWMKBRTCRK90' 
;; with your actual Stacks Mainnet/Testnet address if different.

(define-constant FEE-AMOUNT u50000000) ;; 50 STX (50 * 1,000,000 microSTX)
(define-constant ERR-TRANSFER-FAILED u100)
(define-constant ERR-ALREADY-PAID u101)

;; Define a map to track which collection ID has already been paid for
;; Key: Collection ID (string-ascii 64) | Value: boolean (true = paid)
(define-map collection-paid 
    { collection-id: (string-ascii 64) } 
    bool
)

;; The main public function the user will call via their wallet.
;; It requires the unique collection ID string to track payment history.
(define-public (pay-for-collection-download (collection-id (string-ascii 64)))
    (begin
        ;; 1. Check if this collection ID has already paid
        (asserts! 
            (is-none (map-get? collection-paid {collection-id: collection-id})) 
            ERR-ALREADY-PAID
        )

        ;; 2. Attempt to transfer the STX from the transaction sender to the developer address
        (unwrap-err! (stx-transfer? 
            FEE-AMOUNT 
            tx-sender 
            DEVELOPER-ADDRESS) 
            ERR-TRANSFER-FAILED
        )

        ;; 3. Record the successful payment against the collection ID
        (map-set collection-paid {collection-id: collection-id} true)

        ;; 4. Return success
        (ok true)
    )
)

;; --- READ-ONLY FUNCTIONS ---

;; Check if a collection ID has already been paid for
(define-read-only (has-paid-for-collection (collection-id (string-ascii 64)))
    (ok (is-some (map-get? collection-paid {collection-id: collection-id})))
)

;; Get the current fee amount
(define-read-only (get-fee-amount)
    (ok FEE-AMOUNT)
)

;; Get the developer address
(define-read-only (get-developer-address)
    (ok DEVELOPER-ADDRESS)
)
