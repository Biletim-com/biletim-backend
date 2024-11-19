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
import { PlaneTicket } from '../tickets/plane/entities/plane-ticket.entity';
import { BusTicket } from '../tickets/bus/entities/bus-ticket.entity';

// enums
import { OrderStatus, OrderType } from '@app/common/enums';

@Entity('orders')
export class Order extends AbstractEntity<Order> {
  @Column()
  userEmail: string;

  @Column()
  userPhoneNumber: string;

  @Column('varchar')
  status: OrderStatus;

  @Column('varchar')
  type: OrderType;

  @Column('varchar', { nullable: true })
  pnr?: Nullable<string>;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  user?: Nullable<User>;

  @JoinColumn()
  @OneToOne(() => Transaction, (transaction) => transaction.order)
  transaction: Transaction;

  @OneToMany(() => BusTicket, (busTicket) => busTicket.order)
  busTickets: BusTicket[];

  @OneToMany(() => PlaneTicket, (planeTicket) => planeTicket.order)
  planeTickets: PlaneTicket[];
}
