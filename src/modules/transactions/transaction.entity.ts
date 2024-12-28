import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

import { Wallet } from '../wallets/wallet.entity';
import { BankCard } from '../bank-cards/bank-card.entity';
import { HotelBookingOrder } from '../orders/hotel-booking/entities/hotel-booking-order.entity';
import { BusTicketOrder } from '../orders/bus-ticket/entities/bus-ticket-order.entity';
import { PlaneTicketOrder } from '../orders/plane-ticket/entities/plane-ticket-order.entity';
import { WalletRechargeOrder } from '../orders/wallet-recharge-order/wallet-recharge-order.entity';

// utils
import { normalizeDecimal } from '@app/common/utils';

import {
  Currency,
  PaymentRefundSource,
  PaymentProvider,
  TransactionStatus,
  TransactionType,
} from '@app/common/enums';

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
  paymentProvider: PaymentProvider;

  @Column('varchar', { nullable: true })
  errorMessage?: Nullable<string>;

  @Column('varchar', { nullable: true })
  refundAmount?: Nullable<string>;

  @Column('varchar', { nullable: true })
  refundSource?: Nullable<PaymentRefundSource>;

  // anonymous credit cards
  @Column('varchar', { nullable: true })
  cardholderName?: Nullable<string>;

  // anonymous credit cards
  @Column('varchar', { nullable: true })
  maskedPan?: Nullable<string>;

  // saved card
  @JoinColumn()
  @ManyToOne(() => BankCard, { nullable: true })
  bankCard?: Nullable<BankCard>;

  // wallet
  @JoinColumn()
  @ManyToOne(() => Wallet, { nullable: true })
  wallet?: Nullable<Wallet>;

  // ORDERS
  @OneToOne(
    () => BusTicketOrder,
    (busTicketOrder) => busTicketOrder.transaction,
  )
  busTicketOrder: BusTicketOrder;

  @OneToOne(
    () => HotelBookingOrder,
    (hotelBookingOrder) => hotelBookingOrder.transaction,
  )
  hotelBookingOrder: HotelBookingOrder;

  @OneToOne(
    () => PlaneTicketOrder,
    (planeTicketOrder) => planeTicketOrder.transaction,
  )
  planeTicketOrder: PlaneTicketOrder;

  @OneToOne(
    () => WalletRechargeOrder,
    (walletRechargeOrder) => walletRechargeOrder.transaction,
  )
  walletRechargeOrder: WalletRechargeOrder;
}
