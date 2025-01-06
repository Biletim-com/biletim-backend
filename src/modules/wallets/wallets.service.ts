import { Injectable } from '@nestjs/common';
import { Between, FindOptionsWhere } from 'typeorm';

import { Wallet } from './wallet.entity';
import { Transaction } from '../transactions/transaction.entity';
import { WalletsRepository } from './wallets.repository';
import { TransactionsRepository } from '../transactions/transactions.repository';

// dtos
import { ListResponseDto } from '@app/common/dtos';
import { WalletTransactionHistoryDto } from './dto/wallet-transaction-history.dto';

// errors
import { WalletNotFoundError } from '@app/common/errors';

// types
import { UUID } from '@app/common/types';

@Injectable()
export class WalletsService {
  constructor(
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
  ): Promise<ListResponseDto<Transaction>> {
    const { startDate, endDate } = dto;

    const whereCondition: FindOptionsWhere<Transaction>[] = [
      {
        wallet: {
          user: {
            id: userId,
          },
        },
      },
      {
        walletRechargeOrder: {
          user: {
            id: userId,
          },
        },
      },
    ];

    if (startDate && endDate) {
      whereCondition.forEach((condition) => {
        Object.assign(condition, {
          createdAt: Between(new Date(startDate), new Date(endDate)),
        });
      });
    }

    const [transactions, count] =
      await this.transactionsRepository.findAndCount({
        where: whereCondition,
        order: {
          createdAt: 'DESC',
        },
        take: dto.take,
        skip: dto.skip,
      });

    return { data: transactions, count };
  }
}
