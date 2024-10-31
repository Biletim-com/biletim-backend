import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { CreditCard } from './credit-card.entity';
import { CreditCardsRepository } from './credit-cards.repository';
import { CreditCardsService } from './services/credit-cards.service';
import { CreditCardValidationService } from './services/credit-card-validation.service';
import { CreditCardController } from './credit-cards.controller';
import { UsersRepository } from '../users/users.repository';
import { PaymentModule } from '@app/payment/payment.module';

@Module({
  imports: [PostgreSQLProviderModule.forFeature([CreditCard]), PaymentModule],
  providers: [
    CreditCardsRepository,
    CreditCardsService,
    CreditCardValidationService,
    UsersRepository,
  ],
  controllers: [CreditCardController],
})
export class CreditCardsModule {}
