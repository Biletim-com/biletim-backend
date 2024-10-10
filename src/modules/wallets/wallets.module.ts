import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { Wallet } from './wallet.entity';
import { WalletsRepository } from './wallets.repository';
import { WalletsService } from './wallets.service';

@Module({
  imports: [PostgreSQLProviderModule.forFeature([Wallet])],
  providers: [WalletsRepository, WalletsService],
})
export class WalletsModule {}
