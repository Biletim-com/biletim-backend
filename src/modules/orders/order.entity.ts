import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';
import { User } from '../users/user.entity';
import { Transaction } from '../transactions/transaction.entity';
import { BusTicket } from '../tickets/bus/entities/bus-ticket.entity';

@Entity('orders')
export class Order extends AbstractEntity<Order> {
  @Column('varchar')
  userEmail: string;

  @Column('varchar')
  userPhoneNumber: string;

  @Column('varchar', { nullable: true })
  pnr?: Nullable<string>;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  user?: Nullable<User>;

  @JoinColumn()
  @OneToOne(() => Transaction)
  transaction: Transaction;

  @OneToMany(() => BusTicket, (busTicket) => busTicket.order)
  busTickets: BusTicket[];
}
