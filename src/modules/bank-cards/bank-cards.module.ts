import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { BankCard } from './bank-card.entity';
import { BankCardsRepository } from './bank-cards.repository';
import { BankCardsService } from './services/bank-cards.service';
import { BankCardValidationService } from './services/bank-card-validation.service';
import { BankCardController } from './bank-cards.controller';
import { UsersRepository } from '../users/users.repository';
import { VakifBankPaymentProviderModule } from '@app/providers/payment/vakif-bank/provider.module';

@Module({
  imports: [
    VakifBankPaymentProviderModule,
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
