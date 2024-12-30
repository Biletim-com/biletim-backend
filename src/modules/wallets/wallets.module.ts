import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { Wallet } from './wallet.entity';
import { WalletsRepository } from './wallets.repository';
import { WalletsService } from './wallets.service';
import { WalletController } from './wallets.controller';
import { TransactionsRepository } from '../transactions/transactions.repository';

@Module({
  imports: [PostgreSQLProviderModule.forFeature([Wallet])],
  providers: [WalletsRepository, WalletsService, TransactionsRepository],
  controllers: [WalletController],
})
export class WalletsModule {}
