import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AbstractRepository } from '@app/common/database/postgresql/abstract.repository';

import { Wallet } from './wallet.entity';

// errors
import { InsufficientWalletBalanceError } from '@app/common/errors';

// types
import { UUID } from '@app/common/types';

@Injectable()
export class WalletsRepository extends AbstractRepository<Wallet> {
  constructor(private dataSource: DataSource) {
    super(Wallet, dataSource.createEntityManager());
  }

  async increaseBalance(
    walletIdOrWallet: UUID | Wallet,
    amount: number,
  ): Promise<void> {
    const wallet = await this.findEntityData(walletIdOrWallet);
    const newBalance = wallet.balance + amount;
    await this.update(wallet.id, { balance: newBalance });
  }

  async decreaseBalance(
    walletIdOrWallet: UUID | Wallet,
    amount: number,
  ): Promise<void> {
    const wallet = await this.findEntityData(walletIdOrWallet);
    if (amount > wallet.balance) {
      throw new InsufficientWalletBalanceError();
    }
    const newBalance = wallet.balance - amount;
    await this.update(wallet.id, { balance: newBalance });
  }
}
