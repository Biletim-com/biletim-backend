import { PaymentProvider, TicketType } from '@app/common/enums';
import { UUID } from '@app/common/types';

export type PaymentResultQueryParams = {
  provider: PaymentProvider.BILET_ALL | PaymentProvider.VAKIF_BANK;
  transactionId: UUID;
  ticketType: TicketType;
};
