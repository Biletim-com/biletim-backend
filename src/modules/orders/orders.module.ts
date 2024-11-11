import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { Order } from './order.entity';
import { OrdersRepository } from './orders.repository';

@Module({
  imports: [PostgreSQLProviderModule.forFeature([Order])],
  providers: [OrdersRepository],
})
export class TransactionsModule {}
