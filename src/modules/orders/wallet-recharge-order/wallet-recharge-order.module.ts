import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { WalletRechargeOrder } from './wallet-recharge-order.entity';
import { WalletRechargeOrdersRepository } from './wallet-recharge-order.repository';

@Module({
  imports: [PostgreSQLProviderModule.forFeature([WalletRechargeOrder])],
  providers: [WalletRechargeOrdersRepository],
  exports: [WalletRechargeOrdersRepository],
})
export class WalletRechargeOrderModule {}
