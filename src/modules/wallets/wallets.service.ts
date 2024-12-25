import { Injectable } from '@nestjs/common';

import { WalletsRepository } from './wallets.repository';
import { Wallet } from './wallet.entity';
import { UUID } from '@app/common/types';
import { TransactionsRepository } from '../transactions/transactions.repository';
import { Transaction } from '../transactions/transaction.entity';
import { WalletNotFoundError } from '@app/common/errors';

@Injectable()
export class WalletsService {
  constructor(
    private readonly walletsRespository: WalletsRepository,
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async getMyWallet(userId: UUID): Promise<Wallet> {
    const wallet = await this.walletsRespository.findOne({
      where: {
        user: { id: userId },
      },
    });

    if (!wallet) {
      throw new WalletNotFoundError();
    }

    return wallet;
  }

  async getTransactionHistory(
    userId: UUID,
  ): Promise<Transaction | Transaction[]> {
    const wallet = await this.getMyWallet(userId);

    return this.transactionsRepository.find({
      where: {
        wallet: { id: wallet.id },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
