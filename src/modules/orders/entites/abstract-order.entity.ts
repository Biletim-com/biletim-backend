import { Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { User } from '@app/modules/users/user.entity';

// enums
import { OrderStatus, OrderType } from '@app/common/enums';

export abstract class AbstractOrder<T> extends AbstractEntity<
  AbstractOrder<T>
> {
  @Column()
  userEmail: string;

  @Column()
  userPhoneNumber: string;

  @Column('varchar')
  status: OrderStatus;

  @Column('varchar')
  type: OrderType;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  user?: Nullable<User>;

  @JoinColumn()
  @OneToOne(() => Transaction)
  transaction: Transaction;

  constructor(entity: Partial<T>) {
    super(entity);
    Object.assign(this, entity);
  }
}
