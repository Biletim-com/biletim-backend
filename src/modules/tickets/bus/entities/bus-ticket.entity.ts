import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

import { BusTerminal } from './bus-terminal.entity';

// types
import { DateTime } from '@app/common/types';
import { Order } from '@app/modules/orders/order.entity';
import { BusTicketPassenger } from './bus-ticket-passenger.entity';

@Entity('bus_tickets')
export class BusTicket extends AbstractEntity<BusTicket> {
  @Column()
  ticketOrder: number;

  @Column('varchar', { nullable: true })
  ticketNumber?: Nullable<string>;

  @Column()
  tripTrackingNumber: string;

  @Column()
  companyNumber: string;

  @Column()
  companyName: string;

  @Column()
  routeNumber: string;

  @Column()
  seatNumber: string;

  @Column('varchar')
  travelStartDateTime: DateTime;

  @JoinColumn()
  @OneToOne(
    () => BusTicketPassenger,
    (busTicketPassenger) => busTicketPassenger.id,
    {
      cascade: ['insert'],
      onDelete: 'SET NULL',
    },
  )
  passenger: BusTicketPassenger;

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
