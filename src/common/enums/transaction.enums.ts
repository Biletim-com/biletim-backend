export enum TransactionType {
  PURCHASE = 'purchase',
  DEPOSIT = 'deposit',
  REFUND = 'refund', // A refund was processed for a previously completed transaction
  WITHDRAWAL = 'withdrawal', // The user withdrew funds from their wallet.
  TRANSFER = 'transfer', // Transferring funds between different wallets or accounts.
  ADJUSTMENT = 'adjustment', // An administrative adjustment (e.g., correcting a balance).
}

export enum TransactionStatus {
  PENDING = 'pending', // The transaction has been initiated but is not yet completed.
  PROCESSING = 'processing', // The transaction is currently being processed by the payment system.
  COMPLETED = 'completed', // The transaction was successfully processed.
  FAILED = 'failed', // The transaction failed due to an error (e.g., insufficient funds, invalid card).
  CANCELLED = 'cancelled', // The transaction was cancelled by the user or system.
  REFUND_REQUESTED = 'refund-requested', // Customer has requested a refund for the order.
  REFUND_PROCESSED = 'refund-processed', // The refund for the order has been successfully processed.
}
