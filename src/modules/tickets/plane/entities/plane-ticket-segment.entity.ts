import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

@Entity('plane_ticket_segments')
export class PlaneTicketSegment extends AbstractEntity<PlaneTicketSegment> {
  @Column()
  segmentOrder: number;

  @Column()
  companyNumber: string;

  @Column()
  departureAirport: string;

  @Column()
  arrivalAirport: string;

  @Column()
  departureDate: string;

  @Column()
  arrivalDate: string;

  @Column()
  flightNumber: string;

  @Column()
  flightCode: string;

  @Column()
  flightClass: string;

  @Column()
  airlineCode: string;

  @Column()
  isReturnFlight: boolean;
}
