import { SendTicketGeneratedEmailNotication } from '@app/common/types';
import { Order } from '@app/modules/orders/order.entity';

export type TicketEventsMap = {
  'ticket.bus.purchased': Order;
  'ticket.bus.generated': SendTicketGeneratedEmailNotication;
  'ticket.plane.purchased': Order;
  'ticket.plane.generated': SendTicketGeneratedEmailNotication;
};
