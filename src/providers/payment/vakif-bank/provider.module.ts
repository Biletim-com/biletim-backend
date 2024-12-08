import { Module } from '@nestjs/common';

import { PaymentProvider } from '@app/common/enums';
import { PaymentConfigService } from '@app/configs/payment';
import { PoxClientModule } from '../../pox-client/provider.module';

// services
import { VakifBankCardService } from './services/vakif-bank-card.service';
import { VakifBankCustomerService } from './services/vakif-bank-customer.service';
import { VakifBankEnrollmentService } from './services/vakif-bank-enrollment.service';
import { VakifBankPaymentStrategy } from './vakif-bank-payment.strategy';

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
  providers: [
    VakifBankPaymentStrategy,
    VakifBankCardService,
    VakifBankCustomerService,
    VakifBankEnrollmentService,
  ],
  exports: [
    VakifBankPaymentStrategy,
    VakifBankCardService,
    VakifBankCustomerService,
    VakifBankEnrollmentService,
  ],
})
export class VakifBankPaymentProviderModule {}
