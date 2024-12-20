import { Module } from '@nestjs/common';

import { PaymentProvider } from '@app/common/enums';
import { PaymentConfigService } from '@app/configs/payment';
import { PoxClientModule } from '@app/providers/pox-client/provider.module';
import { BiletAllBusModule } from '@app/providers/ticket/biletall/bus/provider.module';
import { BiletAllPlaneModule } from '@app/providers/ticket/biletall/plane/provider.module';

import { PaymentController } from './payment.controller';

// services
import { PaymentResultService } from './services/payment-result.service';
import { BusTicketStartPaymentService } from './services/bus-ticket-start-payment.service';
import { PlaneTicketStartPaymentService } from './services/plane-ticket-start-payment.service';
import { PaymentResultHandlerProviderFactory } from './factories/payment-result-handler-provider.factory';
import { VakifBankPaymentResultHandlerStrategy } from './strategies/vakif-bank-payment-result-handler.strategy';
import { BiletAllPaymentResultHandlerStrategy } from './strategies/biletall-payment-result-handler.strategy';
import { PaymentProviderFactory } from '@app/providers/payment/payment-provider.factory';
import { BiletAllPaymentStrategy } from '@app/providers/payment/biletall/biletall-payment.strategy';
import { VakifBankPaymentStrategy } from '@app/providers/payment/vakif-bank/vakif-bank-payment.strategy';
import { VakifBankEnrollmentService } from '@app/providers/payment/vakif-bank/services/vakif-bank-enrollment.service';
import { HotelBookingStartPaymentService } from './services/hotel-booking-start-payment.service';
import { RatehawkProviderModule } from '@app/providers/hotel/ratehawk/provider.module';

// repositories
import { UsersRepository } from '@app/modules/users/users.repository';
import { TransactionsRepository } from '@app/modules/transactions/transactions.repository';
import { BusTicketOrdersRepository } from '@app/modules/orders/bus-ticket/bus-ticket-orders.repository';
import { PlaneTicketOrdersRepository } from '@app/modules/orders/plane-ticket/plane-ticket-orders.repository';
import { HotelBookingOrdersRepository } from '@app/modules/orders/hotel-booking/hotel-booking-orders.repository';

@Module({
  imports: [
    BiletAllBusModule,
    BiletAllPlaneModule,
    RatehawkProviderModule,
    PoxClientModule.registerAsync({
      token: `${PaymentProvider.VAKIF_BANK}_VPOS`,
      useFactory: async (configService: PaymentConfigService) =>
        configService.vakifBankVPosBaseUrl,
      inject: [PaymentConfigService],
    }),
    PoxClientModule.registerAsync({
      token: `${PaymentProvider.VAKIF_BANK}_3DS`,
      useFactory: async (configService: PaymentConfigService) =>
        configService.vakifBank3DSBaseUrl,
      inject: [PaymentConfigService],
    }),
  ],
  controllers: [PaymentController],
  providers: [
    VakifBankPaymentStrategy,
    PaymentResultService,
    BusTicketStartPaymentService,
    PlaneTicketStartPaymentService,
    HotelBookingStartPaymentService,
    PaymentProviderFactory,
    PaymentResultHandlerProviderFactory,
    VakifBankEnrollmentService,
    VakifBankPaymentResultHandlerStrategy,
    BiletAllPaymentStrategy,
    BiletAllPaymentResultHandlerStrategy,
    BusTicketOrdersRepository,
    PlaneTicketOrdersRepository,
    HotelBookingOrdersRepository,
    TransactionsRepository,
    UsersRepository,
  ],
})
export class PaymentModule {}
