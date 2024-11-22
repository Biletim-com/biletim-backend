import { Module } from '@nestjs/common';

import { PaymentProvider } from '@app/common/enums';
import { PaymentConfigService } from '@app/configs/payment';
import { PoxClientModule } from '@app/providers/pox-client/provider.module';

import { PaymentController } from './payment.controller';

// services
import { PaymentService } from './services/payment.service';
import { BusTicketPaymentService } from './services/bus-ticket-payment.service';
import { PlaneTicketPaymentService } from './services/plane-ticket-payment.service';
import { PaymentProviderFactory } from './factories/payment-provider.factory';
import { PaymentResultHandlerProviderFactory } from './factories/payment-result-handler-provider.factory';
import { VakifBankCardService } from './providers/vakif-bank/services/vakif-bank-card.service';
import { VakifBankCustomerService } from './providers/vakif-bank/services/vakif-bank-customer.service';
import { VakifBankPaymentStrategy } from './providers/vakif-bank/vakif-bank-payment.strategy';
import { VakifBankPaymentResultHandlerStrategy } from './providers/vakif-bank/vakif-bank-payment-result-handler.strategy';
import { VakifBankEnrollmentService } from './providers/vakif-bank/services/vakif-bank-enrollment.service';
import { TransactionsRepository } from '@app/modules/transactions/transactions.repository';
import { BiletAllPaymentStrategy } from './providers/biletall/biletall-payment.strategy';
import { BiletAllPaymentResultHandlerStrategy } from './providers/biletall/biletall-payment-result-handler.strategy';
import { BiletAllBusService } from '@app/modules/tickets/bus/services/biletall/biletall-bus.service';
import { BiletAllBusParserService } from '@app/modules/tickets/bus/services/biletall/biletall-bus-parser.service';
import { OrdersRepository } from '@app/modules/orders/orders.repository';
import { BiletAllPlaneService } from '@app/modules/tickets/plane/services/biletall/biletall-plane.service';
import { BiletAllPlaneParserService } from '@app/modules/tickets/plane/services/biletall/biletall-plane-parser.service';

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
    PaymentService,
    BusTicketPaymentService,
    PlaneTicketPaymentService,
    PaymentProviderFactory,
    PaymentResultHandlerProviderFactory,
    VakifBankCardService,
    VakifBankCustomerService,
    VakifBankPaymentStrategy,
    VakifBankEnrollmentService,
    VakifBankPaymentResultHandlerStrategy,
    BiletAllPaymentStrategy,
    BiletAllPaymentResultHandlerStrategy,
    TransactionsRepository,
    OrdersRepository,
    BiletAllBusService,
    BiletAllBusParserService,
    BiletAllPlaneService,
    BiletAllPlaneParserService,
  ],
  exports: [
    PaymentProviderFactory,
    VakifBankCardService,
    VakifBankCustomerService,
    VakifBankEnrollmentService,
  ],
})
export class PaymentModule {}
