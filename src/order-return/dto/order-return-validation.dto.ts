import { AbstractOrder } from '@app/modules/orders/abstract-order.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';

export class OrderReturnTotalPenaltyDto {
  totalTicketPrice: string;
  providerPenaltyAmount: string;
  companyPenaltyAmount: string;
  totalPenaltyAmount: string;
  amountToRefund: string;
}

export class OrderReturnValidationDto extends AbstractOrder {
  penalty: OrderReturnTotalPenaltyDto;
  transaction: Transaction;
}
