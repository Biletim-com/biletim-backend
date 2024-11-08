import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

import { Wallet } from '../wallets/wallet.entity';
import { BankCard } from '../bank-cards/bank-card.entity';

// utils
import { normalizeDecimal } from '@app/common/utils';

import {
  Currency,
  PaymentMethod,
  PaymentProvider,
  TransactionStatus,
  TransactionType,
} from '@app/common/enums';
import { Order } from '../orders/order.entity';

@Entity('transactions')
export class Transaction extends AbstractEntity<Transaction> {
  @Column({
    type: 'decimal',
    transformer: {
      to: (value: string) => normalizeDecimal(value),
      from: (value: string) => value,
    },
  })
  amount: string;

  @Column('varchar')
  currency: Currency;

  @Column('varchar')
  status: TransactionStatus;

  @Column('varchar')
  transactionType: TransactionType;

  @Column('varchar')
  paymentMethod: PaymentMethod;

  @Column('varchar', { nullable: true })
  paymentProvider?: Nullable<PaymentProvider>;

  @Column('varchar', { nullable: true })
  errorMessage?: Nullable<string>;

  // anonymous credit cards
  @Column('varchar', { nullable: true })
  cardholderName?: Nullable<string>;

  // anonymous credit cards
  @Column('varchar', { nullable: true })
  maskedPan?: Nullable<string>;

  @OneToOne(() => Order, (busTicket) => busTicket.transaction)
  order: Order;

  // saved card
  @JoinColumn()
  @ManyToOne(() => BankCard, { nullable: true })
  bankCard?: Nullable<BankCard>;

  // wallet
  @JoinColumn()
  @ManyToOne(() => Wallet, { nullable: true })
  wallet?: Nullable<Wallet>;
}
