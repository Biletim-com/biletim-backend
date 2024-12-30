import { Entity, Column, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

import { Passenger } from '../passengers/passenger.entity';
import { BankCard } from '../bank-cards/bank-card.entity';
import { Verification } from '../verification/verification.entity';
import { Wallet } from '../wallets/wallet.entity';

@Entity('users')
export class User extends AbstractEntity<User> {
  @Column()
  name: string;

  @Column()
  familyName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', nullable: true })
  phone?: Nullable<string>;

  @Column({ type: 'varchar', nullable: true })
  address?: Nullable<string>;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'uuid', nullable: true })
  forgotPasswordCode?: Nullable<string>;

  @Column({ default: false })
  isUsed: boolean;

  @OneToMany(() => Verification, (verification) => verification.user, {
    cascade: ['insert', 'update'],
  })
  verification: Verification[];

  @OneToMany(() => Passenger, (passenger) => passenger.user)
  passengers: Passenger[];

  @OneToMany(() => BankCard, (bankCard) => bankCard.user)
  bankCards: BankCard[];

  @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: ['insert'] })
  wallet: Wallet;
}
