import { PaymentProvider, TicketType } from '@app/common/enums';
import { UUID } from '@app/common/types';

export type PaymentResultQueryParams =
  | {
      provider: PaymentProvider.BILET_ALL;
      transactionId: UUID;
      ticketType: TicketType;
    }
  | {
      provider: PaymentProvider.VAKIF_BANK;
      transactionId?: undefined;
      ticketType: TicketType;
    };
