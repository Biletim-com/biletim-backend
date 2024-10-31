import { Module } from '@nestjs/common';

import { PaymentProvider } from '@app/common/enums';
import { PaymentConfigService } from '@app/configs/payment';
import { PoxClientModule } from '@app/providers/pox-client/provider.module';

import { PaymentController } from './payment.controller';

// services
import { VakifBankCardService } from './providers/vakif-bank/services/vakif-bank-card.service';
import { VakifBankCustomerService } from './providers/vakif-bank/services/vakif-bank-customer.service';
import { VakifBankPaymentStrategy } from './providers/vakif-bank/vakif-bank-payment.strategy';
import { VakifBankEnrollmentService } from './providers/vakif-bank/services/vakif-bank-enrollment.service';
import { PaymentProviderFactory } from './factories/payment-provider.factory';
import { PaymentService } from './services/payment.service';
import { PaymentResponseHandlerService } from './services/payment-response-handler.service';
import { TransactionsRepository } from '@app/modules/transactions/transactions.repository';

@Module({
  imports: [
    PoxClientModule.registerAsync({
      token: `${PaymentProvider.VAKIF_BANK}_VPOS`,
      useFactory: async (configService: PaymentConfigService) =>
        configService.vPosBaseUrl,
      inject: [PaymentConfigService],
    }),
    PoxClientModule.registerAsync({
      token: `${PaymentProvider.VAKIF_BANK}_3DS`,
      useFactory: async (configService: PaymentConfigService) =>
        configService.threeDSecureBaseUrl,
      inject: [PaymentConfigService],
    }),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentProviderFactory,
    PaymentService,
    PaymentResponseHandlerService,
    VakifBankCardService,
    VakifBankCustomerService,
    VakifBankPaymentStrategy,
    VakifBankEnrollmentService,
    TransactionsRepository,
  ],
  exports: [
    PaymentProviderFactory,
    VakifBankCardService,
    VakifBankCustomerService,
    VakifBankEnrollmentService,
  ],
})
export class PaymentModule {}
