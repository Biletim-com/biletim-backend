import { SendPlaneTicketGeneratedEmailNotication } from '@app/common/types';
import { Order } from '@app/modules/orders/order.entity';

export type TicketEventsMap = {
  'ticket.bus.purchased': Order;
  'ticket.plane.purchased': Order;
  'ticket.plane.generated': SendPlaneTicketGeneratedEmailNotication;
};
