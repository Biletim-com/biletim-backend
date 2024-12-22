import { OrderReturnTotalPenaltyDto } from '@app/common/dtos';
import { AbstractOrder } from '@app/modules/orders/abstract-order.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';

export class OrderReturnValidationDto extends AbstractOrder {
  penalty: OrderReturnTotalPenaltyDto;
  transaction: Transaction;
}
