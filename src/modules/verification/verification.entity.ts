import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';
import { DateTime } from '@app/common/types';
import { VerificationType } from '@app/common/enums/verification.enums';

@Entity('verifications')
export class Verification extends AbstractEntity<Verification> {
  @Column()
  verificationCode: number;

  @Column({ default: false })
  isUsed: boolean;

  @Column({ type: 'timestamp' })
  expiredAt: DateTime;

  @Column({ type: 'varchar' })
  type: VerificationType;

  @ManyToOne(() => User, (user) => user.verification, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  user?: Nullable<User>;

  @ManyToOne(() => Order, (order) => order.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  order?: Nullable<Order>;
}
