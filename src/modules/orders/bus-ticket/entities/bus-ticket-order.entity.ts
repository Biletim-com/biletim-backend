import {
  Entity,
  OneToOne,
  JoinColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';

// entities
import { AbstractOrder } from '../../abstract-order.entity';
import { Invoice } from '@app/modules/invoices/invoice.entity';
import { BusTicket } from './bus-ticket.entity';
import { BusTerminal } from '@app/modules/tickets/bus/entities/bus-terminal.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';

// types
import { DateTime } from '@app/common/types';

@Entity('bus_ticket_orders')
export class BusTicketOrder extends AbstractOrder<BusTicketOrder> {
  @Column('varchar', { nullable: true })
  pnr?: Nullable<string>;

  @Column()
  tripTrackingNumber: string;

  @Column()
  companyNumber: string;

  @Column()
  companyName: string;

  @Column()
  routeNumber: string;

  @Column('varchar')
  travelStartDateTime: DateTime;

  @JoinColumn()
  @ManyToOne(() => BusTerminal, { onDelete: 'SET NULL' })
  departureTerminal: BusTerminal;

  @JoinColumn()
  @ManyToOne(() => BusTerminal, { onDelete: 'SET NULL' })
  arrivalTerminal: BusTerminal;

  @OneToMany(() => BusTicket, (busTicket) => busTicket.order)
  tickets: BusTicket[];

  @JoinColumn()
  @OneToOne(() => Invoice, (invoice) => invoice.busTicketOrder, {
    nullable: true,
    cascade: ['insert'],
  })
  invoice?: Nullable<Invoice>;

  @JoinColumn()
  @OneToOne(() => Transaction, (transaction) => transaction.busTicketOrder)
  transaction: Transaction;
}
