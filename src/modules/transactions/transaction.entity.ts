import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

import { User } from '../users/user.entity';
import { Wallet } from '../wallets/wallet.entity';
import { BankCard } from '../bank-cards/bank-card.entity';

import {
  Currency,
  TransactionStatus,
  TransactionType,
} from '@app/common/enums';

@Entity('transactions')
export class Transaction extends AbstractEntity<Transaction> {
  @Column()
  amount: number;

  @Column('varchar')
  currency: Currency;

  @Column('varchar')
  status: TransactionStatus;

  @Column('varchar')
  transactionType: TransactionType;

  @JoinColumn()
  @ManyToOne(() => BankCard, (bankCard) => bankCard.id, { nullable: true })
  bankCard?: Nullable<BankCard>;

  @JoinColumn()
  @ManyToOne(() => Wallet, (wallet) => wallet.id, { nullable: true })
  wallet?: Nullable<Wallet>;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
