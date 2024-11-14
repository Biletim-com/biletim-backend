import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

@Entity('plane_ticket_segments')
export class PlaneTicketSegment extends AbstractEntity<PlaneTicketSegment> {
  @Column()
  departureAirport: string;

  @Column()
  arrivalAirport: string;

  @Column()
  ticketOrder: number;

  @Column()
  departureDate: string;

  @Column()
  arrivalDate: string;

  @Column()
  flightNo: string;

  @Column()
  airlineCode: string;

  @Column()
  travelClass: string;

  @Column()
  isReturnSegment: boolean;

  @Column()
  flightCode?: string;
}
