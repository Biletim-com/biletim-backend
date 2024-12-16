export enum OrderStatus {
  PENDING = 'pending', // The order is created but payment has not yet been initiated.
  PAYMENT_INITIATED = 'payment-initiated', // Payment process has started but is not yet completed.
  PAYMENT_FAILED = 'payment-failed', // Payment attempt failed, possibly due to card issues or network problems.
  AWAITING = 'awaiting-confirmation', // Payment is completed, but confirmation from the ticket provider is pending.
  CONFIRMED = 'confirmed', // The order and payment have been successfully confirmed; tickets are ready for issuance.
  TICKETS_ISSUED = 'tickets-issued', // Tickets have been successfully generated and delivered to the customer.
  CANCELED = 'canceled', // The order was canceled by the user or due to a failed confirmation.
  REFUND_REQUESTED = 'refund-requested', // Customer has requested a refund for the order.
  REFUND_PROCESSED = 'refund-processed', // The refund for the order has been successfully processed.
  COMPLETED = 'completed', // The order has been successfully completed, and no further action is required.
  REJECTED = 'rejected', // The order has been successfully completed, and no further action is required.
}

export enum OrderType {
  PURCHASE = 'purchase',
  RESERVATION = 'reservation',
}
