import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

// entites
import { PlaneTicketOrder } from './plane-ticket-order.entity';
import { Airport } from '@app/providers/ticket/biletall/plane/entities/airport.entity';
import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

// dtos
import { FlightSegmentFareDetailsDto } from '@app/common/dtos';

// constants
import { airlineCompaniesAgeRules } from '@app/common/constants';

@Entity('plane_ticket_segments')
export class PlaneTicketSegment extends AbstractEntity<PlaneTicketSegment> {
  @Column()
  segmentOrder: number;

  @Column()
  companyNumber: string;

  @Column()
  departureDateTime: string;

  @Column()
  arrivalDateTime: string;

  @Column()
  flightNumber: string;

  @Column()
  flightCode: string;

  @Column()
  flightClassCode: string;

  @Column('jsonb')
  flightFareDetails: FlightSegmentFareDetailsDto;

  @Column()
  airlineCode: string;

  @Column()
  airlineName: string;

  @Column()
  isReturnFlight: boolean;

  @JoinColumn({
    name: 'departure_airport_code',
    referencedColumnName: 'airportCode',
  })
  @ManyToOne(() => Airport, (airport) => airport.airportCode)
  departureAirport: Airport;

  @JoinColumn({
    name: 'arrival_airport_code',
    referencedColumnName: 'airportCode',
  })
  @ManyToOne(() => Airport, (airport) => airport.airportCode)
  arrivalAirport: Airport;

  @JoinColumn()
  @ManyToOne(
    () => PlaneTicketOrder,
    (planeTicketOrder) => planeTicketOrder.segments,
  )
  order: PlaneTicketOrder;

  constructor(
    planeTicketSegment: Partial<PlaneTicketSegment> & { companyNumber: string },
  ) {
    super(planeTicketSegment);
    this.airlineName =
      airlineCompaniesAgeRules[planeTicketSegment?.companyNumber]?.companyName;
  }
}
