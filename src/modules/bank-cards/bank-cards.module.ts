import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { BankCard } from './bank-card.entity';
import { BankCardsRepository } from './bank-cards.repository';
import { BankCardsService } from './bank-cards.service';

@Module({
  imports: [PostgreSQLProviderModule.forFeature([BankCard])],
  providers: [BankCardsRepository, BankCardsService],
})
export class BankCardsModule {}
