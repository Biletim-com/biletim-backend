import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { BankCard } from './bank-card.entity';
import { BankCardsRepository } from './bank-cards.repository';
import { BankCardsService } from './services/bank-cards.service';
import { BankCardValidationService } from './services/bank-card-validation.service';
import { CreditCardController } from './bank-cards.controller';
import { UsersRepository } from '../users/users.repository';
import { PaymentModule } from '@app/payment/payment.module';

@Module({
  imports: [PostgreSQLProviderModule.forFeature([BankCard]), PaymentModule],
  providers: [
    BankCardsRepository,
    BankCardsService,
    BankCardValidationService,
    UsersRepository,
  ],
  controllers: [CreditCardController],
})
export class BankCardsModule {}
