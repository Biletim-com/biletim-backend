import { Module } from '@nestjs/common';

// entites
import { BankCard } from './bank-card.entity';

// repositories
import { UsersRepository } from '../users/users.repository';
import { BankCardsRepository } from './bank-cards.repository';

// services
import { BankCardsService } from './services/bank-cards.service';
import { BankCardValidationService } from './services/bank-card-validation.service';
import { ProvidersBankCardService } from './services/provider-bank-card-create.service';

// controllers
import { BankCardController } from './bank-cards.controller';

// providers
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';
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
    ProvidersBankCardService,
    BankCardValidationService,
    UsersRepository,
  ],
  controllers: [BankCardController],
})
export class BankCardsModule {}
