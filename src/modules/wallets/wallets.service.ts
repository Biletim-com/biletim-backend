import { Injectable } from '@nestjs/common';

import { WalletsRepository } from './wallets.repository';
import { Wallet } from './wallet.entity';
import { UUID } from '@app/common/types';
import { TransactionsRepository } from '../transactions/transactions.repository';
import { Transaction } from '../transactions/transaction.entity';
import { WalletNotFoundError } from '@app/common/errors';
import { WalletTransactionHistoryDto } from './dto/wallet-transaction-history.dto';
import { Between, DataSource } from 'typeorm';

@Injectable()
export class WalletsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly walletsRepository: WalletsRepository,
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async getMyWallet(userId: UUID): Promise<Wallet> {
    const wallet = await this.walletsRepository.findOne({
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
    dto: WalletTransactionHistoryDto,
    offset?: number,
    limit?: number,
  ): Promise<{ transactions: Transaction[]; totalCount: number }> {
    const { startDate, endDate } = dto;

    const whereCondition: any = {
      wallet: {
        user: {
          id: userId,
        },
      },
    };

    if (startDate && endDate) {
      whereCondition.createdAt = Between(
        new Date(startDate),
        new Date(endDate),
      );
    }

    const allTransactions = await this.transactionsRepository.find({
      where: whereCondition,
      order: {
        createdAt: 'DESC',
      },
    });

    const totalCount = allTransactions.length;

    const startIndex = Math.min(offset || 0, totalCount);
    const endIndex = limit
      ? Math.min(startIndex + limit, totalCount)
      : totalCount;

    if (startIndex >= totalCount || startIndex < 0 || (limit && limit <= 0)) {
      return {
        transactions: [],
        totalCount,
      };
    }

    const slicedTransactions = allTransactions.slice(startIndex, endIndex);

    return {
      transactions: slicedTransactions,
      totalCount,
    };
  }
}
