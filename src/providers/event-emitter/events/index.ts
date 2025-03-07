import { UserEventsMap } from './user-events.type';
import { TicketEventsMap } from './ticket-events';
import { OrderEventsMap } from './order-events.type';
import { PaymentEventsMap } from './payment-events.type';

export type EventsMap = UserEventsMap &
  TicketEventsMap &
  OrderEventsMap &
  PaymentEventsMap;
