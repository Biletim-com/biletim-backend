import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';


import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';

@Entity('verifications')
export class Verification extends AbstractEntity<Verification> {
  @Column()
  verificationCode: number;

  @Column({ default: false })
  isUsed: boolean;

  @Column({ default: false })
  isExpired: boolean;

  @OneToOne(() => User, (user) => user.verification, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn()
  user?: Nullable<User>;

  @ManyToOne(() => Order, (order) => order.id, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn()
  order?: Nullable<Order>;
}
