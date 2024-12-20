import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';
import { PlaneTicketPassenger } from './plane-ticket-passenger.entity';
import { PlaneTicketOrder } from './plane-ticket-order.entity';

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

  @JoinColumn()
  @ManyToOne(() => PlaneTicketOrder, (order) => order.tickets, {
    onDelete: 'SET NULL',
  })
  order: PlaneTicketOrder;
}
