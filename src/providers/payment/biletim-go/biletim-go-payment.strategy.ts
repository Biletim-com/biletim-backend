import { Injectable } from '@nestjs/common';

// interfaces
import { IPayment } from '../interfaces/payment.interface';

// repositories
import { WalletsRepository } from '@app/modules/wallets/wallets.repository';
import { TransactionsRepository } from '@app/modules/transactions/transactions.repository';

// dto
import { PaymentFinishDto } from '../dto/payment-finish.dto';
import { CancelPaymentDto } from '../dto/cancel-payment.dto';
import { RefundPaymentDto } from '../dto/refund-payment.dto';
import { BiletimGoPaymentResultDto } from './dto/biletim-go-payment-result.dto';

// errors
import {
  WalletNotFoundError,
  InsufficientWalletBalanceError,
  TransactionNotFoundError,
} from '@app/common/errors';

// types
import { UUID } from '@app/common/types';

@Injectable()
export class BiletimGoPaymentStrategy implements IPayment {
  constructor(
    private readonly walletsRepository: WalletsRepository,
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async start3DSAuthorization(): Promise<null> {
    throw new Error('Method not implemented.');
  }

  async finishPayment({
    details,
  }: PaymentFinishDto<BiletimGoPaymentResultDto>): Promise<void> {
    const { amount, walletId } = details;
    const wallet = await this.walletsRepository.findOneBy({ id: walletId });
    if (!wallet) {
      throw new WalletNotFoundError();
    }
    if (Number(amount) > wallet.balance) {
      throw new InsufficientWalletBalanceError();
    }
    const newBalance = wallet.balance - Number(amount);
    await this.walletsRepository.update(walletId, { balance: newBalance });
  }

  async cancelPayment({ transactionId }: CancelPaymentDto): Promise<void> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id: transactionId },
      relations: {
        wallet: true,
      },
    });
    if (!transaction) {
      throw new TransactionNotFoundError();
    }
    if (!transaction.wallet) {
      throw new WalletNotFoundError();
    }
    const newBalance = transaction.wallet.balance + Number(transaction.amount);
    await this.walletsRepository.update(transaction.wallet.id, {
      balance: newBalance,
    });
  }

  async refundPayment({
    refundAmount,
    transactionId,
    details: { walletId },
  }: RefundPaymentDto<{ walletId: UUID }>): Promise<void> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id: transactionId },
      relations: { wallet: true },
    });
    if (!transaction) {
      throw new TransactionNotFoundError();
    }

    const wallet =
      transaction.wallet ??
      (await this.walletsRepository.findOneBy({ id: walletId }));

    if (!wallet) {
      throw new WalletNotFoundError();
    }

    await this.walletsRepository.update(wallet.id, {
      balance: wallet.balance + Number(refundAmount),
    });
  }
}
