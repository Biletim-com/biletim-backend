import { Check, Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

import { User } from '../users/user.entity';

@Entity('wallets')
@Check(`"balance" >= 0`)
export class Wallet extends AbstractEntity<Wallet> {
  @Column({
    default: 0,
    type: 'decimal',
    transformer: {
      from: (value: string) => Number(value),
      to: (value: string) => value,
    },
  })
  balance: number;

  @JoinColumn()
  @OneToOne(() => User, (user) => user.id)
  user: User;
}
