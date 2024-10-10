export enum TransactionStatus {
  PENDING = 'pending', // The transaction has been initiated but is not yet completed.
  COMPLETED = 'completed', // The transaction was successfully processed.
  FAILED = 'failed', // The transaction failed due to an error (e.g., insufficient funds, invalid card).
  CANCELLED = 'cancelled', // The transaction was cancelled by the user or system.
  PROCESSING = 'processing', // The transaction is currently being processed by the payment system.
}
