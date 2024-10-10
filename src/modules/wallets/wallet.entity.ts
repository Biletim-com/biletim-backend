import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

import { User } from '../users/user.entity';

@Entity('wallets')
export class Wallet extends AbstractEntity<Wallet> {
  @Column({ default: 0 })
  balance: number;

  @JoinColumn()
  @OneToOne(() => User, (user) => user.id)
  user: User;
}
