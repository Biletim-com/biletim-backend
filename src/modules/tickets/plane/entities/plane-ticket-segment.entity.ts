import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

// entites
import { Airport } from './airport.entity';
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

  constructor(
    planeTicketSegment: Partial<PlaneTicketSegment> & { companyNumber: string },
  ) {
    super(planeTicketSegment);
    this.airlineName =
      airlineCompaniesAgeRules[planeTicketSegment?.companyNumber]?.companyName;
  }
}
