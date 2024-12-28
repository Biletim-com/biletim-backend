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
    await this.walletsRepository.decreaseBalance(walletId, Number(amount));
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
    await this.walletsRepository.increaseBalance(
      transaction.wallet,
      Number(transaction.amount),
    );
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
    const walletIdOrWallet = transaction.wallet ?? walletId;
    await this.walletsRepository.increaseBalance(
      walletIdOrWallet,
      Number(refundAmount),
    );
  }
}
