import { UUID } from '@app/common/types';
import { BusTicketSaleDto } from '@app/modules/tickets/bus/dto/bus-ticket-sale.dto';
import { BusTicketSaleRequest } from '@app/modules/tickets/bus/services/biletall/types/biletall-sale-request.type';

export class BiletAllPaymentResultDto extends BusTicketSaleDto {
  public readonly transactionId: UUID;
  constructor(busTicketSaleRequest: BusTicketSaleRequest, transactionId: UUID) {
    super(busTicketSaleRequest);
    this.transactionId = transactionId;
  }
}
