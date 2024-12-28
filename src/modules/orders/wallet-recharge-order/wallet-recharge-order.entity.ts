import { Entity, OneToOne, JoinColumn, ManyToOne } from 'typeorm';

// entities
import { AbstractOrder } from '../abstract-order.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { Wallet } from '@app/modules/wallets/wallet.entity';

@Entity('wallet_recharge_orders')
export class WalletRechargeOrder extends AbstractOrder<WalletRechargeOrder> {
  @JoinColumn()
  @OneToOne(() => Transaction, (transaction) => transaction.walletRechargeOrder)
  transaction: Transaction;

  @JoinColumn()
  @ManyToOne(() => Wallet)
  wallet: Wallet;
}
