import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';
import { PlaneTicketPassenger } from './plane-ticket-passenger.entity';
import { PlaneTicketSegment } from './plane-ticket-segment.entity';
import { Order } from '@app/modules/orders/order.entity';

@Entity('plane_tickets')
export class PlaneTicket extends AbstractEntity<PlaneTicket> {
  @Column()
  ticketOrder: number;

  @Column('varchar', { nullable: true })
  ticketNumber?: Nullable<string>;

  @Column()
  netPrice: string;

  @Column()
  taxAmount: string;

  @Column()
  serviceFee: string;

  @Column()
  biletimFee: string;

  @JoinColumn()
  @OneToOne(
    () => PlaneTicketPassenger,
    (planeTicketPassenger) => planeTicketPassenger.id,
    {
      cascade: ['insert'],
      onDelete: 'SET NULL',
    },
  )
  passenger: PlaneTicketPassenger;

  @JoinTable()
  @ManyToMany(() => PlaneTicketSegment, { cascade: ['insert'] })
  segments: PlaneTicketSegment[];

  @JoinColumn()
  @ManyToOne(() => Order, (order) => order.planeTickets, {
    onDelete: 'SET NULL',
  })
  order: Order;
}
