export enum TransactionType {
  PURCHASE = 'purchase',
  DEPOSIT = 'deposit',
  REFUND = 'refund', // A refund was processed for a previously completed transaction
  WITHDRAWAL = 'withdrawal', // The user withdrew funds from their wallet.
  TRANSFER = 'transfer', // Transferring funds between different wallets or accounts.
  ADJUSTMENT = 'adjustment', // An administrative adjustment (e.g., correcting a balance).
}
