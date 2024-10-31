import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

import { Wallet } from '../wallets/wallet.entity';
import { CreditCard } from '../credit-cards/credit-card.entity';

import {
  Currency,
  PaymentMethod,
  TransactionStatus,
  TransactionType,
} from '@app/common/enums';
import { Order } from '../orders/order.entity';

@Entity('transactions')
export class Transaction extends AbstractEntity<Transaction> {
  @Column({ type: 'decimal' })
  amount: number;

  @Column('varchar')
  currency: Currency;

  @Column('varchar')
  status: TransactionStatus;

  @Column('varchar')
  transactionType: TransactionType;

  @Column('varchar')
  paymentMethod: PaymentMethod;

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
  @ManyToOne(() => CreditCard, { nullable: true })
  creditCard?: Nullable<CreditCard>;

  // wallet
  @JoinColumn()
  @ManyToOne(() => Wallet, { nullable: true })
  wallet?: Nullable<Wallet>;
}
