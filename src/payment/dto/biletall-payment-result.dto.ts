import { UUID } from '@app/common/types';
import { BusTicketPurchaseDto } from '@app/providers/ticket/biletall/bus/dto/bus-ticket-purchase.dto';
import { BusTicketPurchaseRequest } from '@app/providers/ticket/biletall/bus/types/biletall-bus-ticket-purchase.type';

export class BiletAllPaymentResultDto extends BusTicketPurchaseDto {
  public readonly transactionId: UUID;
  constructor(
    busTicketSaleRequest: BusTicketPurchaseRequest,
    transactionId: UUID,
  ) {
    super(busTicketSaleRequest);
    this.transactionId = transactionId;
  }
}
