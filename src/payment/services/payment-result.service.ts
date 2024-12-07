import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { TransactionsRepository } from '@app/modules/transactions/transactions.repository';

// entities
import { Transaction } from '@app/modules/transactions/transaction.entity';

// types
import { UUID } from '@app/common/types';

@Injectable()
export class PaymentResultService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async getTransaction(transactionId: UUID): Promise<Transaction> {
    const tranaction = await this.transactionsRepository.findOneBy({
      id: transactionId,
    });
    if (!tranaction) {
      throw new NotFoundException('Transaction is not found');
    }

    const minuteDifference =
      (new Date().getTime() - new Date(tranaction?.createdAt).getTime()) /
      (1000 * 60);

    if (minuteDifference > 3) {
      throw new BadRequestException('Transaction is expired');
    }
    return tranaction;
  }
}
