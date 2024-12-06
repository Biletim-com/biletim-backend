import { UUID } from '@app/common/types';
import { BusTicketSaleDto } from '@app/providers/ticket/biletall/bus/dto/bus-ticket-sale.dto';
import { BusTicketSaleRequest } from '@app/providers/ticket/biletall/types/biletall-sale-request.type';

export class BiletAllPaymentResultDto extends BusTicketSaleDto {
  public readonly transactionId: UUID;
  constructor(busTicketSaleRequest: BusTicketSaleRequest, transactionId: UUID) {
    super(busTicketSaleRequest);
    this.transactionId = transactionId;
  }
}
