import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';

// entities
import { AbstractOrder } from '../../abstract-order.entity';
import { Invoice } from '@app/modules/invoices/invoice.entity';
import { PlaneTicket } from './plane-ticket.entity';
import { PlaneTicketSegment } from './plane-ticket-segment.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';

@Entity('plane_ticket_orders')
export class PlaneTicketOrder extends AbstractOrder<PlaneTicketOrder> {
  @Column('varchar', { nullable: true })
  pnr?: Nullable<string>;

  @OneToMany(() => PlaneTicket, (planeTicket) => planeTicket.order)
  tickets: PlaneTicket[];

  @OneToMany(
    () => PlaneTicketSegment,
    (planeTicketSegment) => planeTicketSegment.order,
  )
  segments: PlaneTicketSegment[];

  @JoinColumn()
  @OneToOne(() => Invoice, (invoice) => invoice.planeTicketOrder, {
    cascade: ['insert'],
  })
  invoice: Invoice;

  @JoinColumn()
  @OneToOne(() => Transaction, (transaction) => transaction.planeTicketOrder)
  transaction: Transaction;
}
