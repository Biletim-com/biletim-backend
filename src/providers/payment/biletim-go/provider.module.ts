import { Module } from '@nestjs/common';
import { BiletimGoPaymentStrategy } from './biletim-go-payment.strategy';
import { WalletsRepository } from '@app/modules/wallets/wallets.repository';
import { TransactionsRepository } from '@app/modules/transactions/transactions.repository';

@Module({
  providers: [
    BiletimGoPaymentStrategy,
    WalletsRepository,
    TransactionsRepository,
  ],
  exports: [BiletimGoPaymentStrategy],
})
export class BiletimGoPaymentProviderModule {}
