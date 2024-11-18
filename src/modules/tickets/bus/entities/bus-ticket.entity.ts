import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

import { BusTerminal } from './bus-terminal.entity';

// enums
import { Gender } from '@app/common/enums';

// types
import { DateISODate, DateTime } from '@app/common/types';
import { Order } from '@app/modules/orders/order.entity';

@Entity('bus_tickets')
export class BusTicket extends AbstractEntity<BusTicket> {
  @Column()
  companyNumber: string;

  @Column()
  companyName: string;

  @Column('varchar', { nullable: true })
  ticketNumber?: Nullable<string>;

  @Column()
  ticketOrder: number;

  @Column()
  routeNumber: string;

  @Column()
  tripTrackingNumber: string;

  @Column()
  seatNumber: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('varchar')
  gender: Gender;

  @Column('varchar')
  travelStartDateTime: DateTime;

  @Column()
  isTurkishCitizen: boolean;

  @Column('varchar', { nullable: true, length: 11 })
  tcNumber?: Nullable<string>;

  @Column('varchar', { nullable: true })
  passportCountryCode?: Nullable<string>;

  @Column('varchar', { nullable: true })
  passportNumber?: Nullable<string>;

  @Column('date', { nullable: true })
  passportExpirationDate?: Nullable<DateISODate>;

  @JoinColumn()
  @ManyToOne(() => BusTerminal, { onDelete: 'SET NULL' })
  departureTerminal: BusTerminal;

  @JoinColumn()
  @ManyToOne(() => BusTerminal, { onDelete: 'SET NULL' })
  arrivalTerminal: BusTerminal;

  @JoinColumn()
  @ManyToOne(() => Order, (order) => order.busTickets, { onDelete: 'SET NULL' })
  order: Order;
}
