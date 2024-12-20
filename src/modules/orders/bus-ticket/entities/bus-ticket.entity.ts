import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

// types

import { BusTicketOrder } from './bus-ticket-order.entity';
import { BusTicketPassenger } from './bus-ticket-passenger.entity';

// enums
import { Currency } from '@app/common/enums';

@Entity('bus_tickets')
export class BusTicket extends AbstractEntity<BusTicket> {
  @Column()
  ticketOrder: number;

  @Column()
  ticketPrice: string;

  @Column('varchar')
  currency: Currency;

  @Column('varchar', { nullable: true })
  ticketNumber?: Nullable<string>;

  @Column()
  seatNumber: string;

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
  @ManyToOne(() => BusTicketOrder, (busTicketOrder) => busTicketOrder.tickets, {
    onDelete: 'SET NULL',
  })
  order: BusTicketOrder;
}
