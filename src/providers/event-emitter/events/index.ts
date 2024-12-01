import { UserEventsMap } from './user-events.type';
import { TicketEventsMap } from './ticket-events';

export type EventsMap = UserEventsMap & TicketEventsMap;
