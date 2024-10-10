import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { Transaction } from './transaction.entity';
import { TransactionsRepository } from './transactions.repository';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [PostgreSQLProviderModule.forFeature([Transaction])],
  providers: [TransactionsRepository, TransactionsService],
})
export class TransactionsModule {}
