import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { BankCard } from './bank-card.entity';
import { BankCardsRepository } from './bank-cards.repository';
import { BankCardsService } from './services/bank-cards.service';
import { BankCardValidationService } from './services/bank-card-validation.service';
import { BankCardController } from './bank-cards.controller';
import { UsersRepository } from '../users/users.repository';

// providers
import { VakifBankPaymentProviderModule } from '@app/providers/payment/vakif-bank/provider.module';
import { GarantiPaymentProviderModule } from '@app/providers/payment/garanti/provider.module';

@Module({
  imports: [
    VakifBankPaymentProviderModule,
    GarantiPaymentProviderModule,
    PostgreSQLProviderModule.forFeature([BankCard]),
  ],
  providers: [
    BankCardsRepository,
    BankCardsService,
    BankCardValidationService,
    UsersRepository,
  ],
  controllers: [BankCardController],
})
export class BankCardsModule {}
