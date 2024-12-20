import { Column, ManyToOne, JoinColumn } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';
import { User } from '@app/modules/users/user.entity';

// enums
import { OrderStatus, OrderCategory, OrderType } from '@app/common/enums';
import { Transaction } from '../transactions/transaction.entity';

export abstract class AbstractOrder<
  Order = object,
> extends AbstractEntity<Order> {
  @Column()
  userEmail: string;

  @Column()
  userPhoneNumber: string;

  @Column('varchar')
  status: OrderStatus;

  @Column('varchar')
  category: OrderCategory;

  @Column('varchar')
  type: OrderType;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  user?: Nullable<User>;

  abstract transaction: Transaction;
}
