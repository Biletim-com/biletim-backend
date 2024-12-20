import { SendPlaneTicketGeneratedEmailNotication } from '@app/common/types';
import { BusTicketOrder } from '@app/modules/orders/bus-ticket/entities/bus-ticket-order.entity';
import { PlaneTicketOrder } from '@app/modules/orders/plane-ticket/entities/plane-ticket-order.entity';

export type TicketEventsMap = {
  'ticket.bus.purchased': BusTicketOrder;
  'ticket.plane.purchased': PlaneTicketOrder;
  'ticket.plane.generated': SendPlaneTicketGeneratedEmailNotication;
};
