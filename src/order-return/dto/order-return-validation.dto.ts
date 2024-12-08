import { Order } from '@app/modules/orders/order.entity';

export class OrderReturnTotalPenaltyDto {
  totalTicketPrice: string;
  providerPenaltyAmount: string;
  companyPenaltyAmount: string;
  totalPenaltyAmount: string;
  amountToRefund: string;
}

export class OrderReturnValidationDto extends Order {
  penalty: OrderReturnTotalPenaltyDto;
}
