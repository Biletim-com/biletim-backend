import { Module } from '@nestjs/common';

// controllers
import { PaymentStartController } from './controllers/payment-start.controller';
import { PaymentProcessingController } from './controllers/payment-processing.controller';

// providers
import { PaymentProviderModule } from '@app/providers/payment/provider.module';
import { TicketProviderModule } from '@app/providers/ticket/provider.module';
import { HotelProviderModule } from '@app/providers/hotel/provider.module';
import { PoxClientModule } from '@app/providers/pox-client/provider.module';

// services
import { PaymentConfigService } from '@app/configs/payment';
import { TransactionStatusService } from './services/transaction-status.service';
import { BusTicketStartPaymentService } from './services/bus-ticket-start-payment.service';
import { PlaneTicketStartPaymentService } from './services/plane-ticket-start-payment.service';
import { HotelBookingStartPaymentService } from './services/hotel-booking-start-payment.service';
import { WalletRechargeStartPaymentService } from './services/wallet-recharge-start-payment.service';
import { PaymentProcessingService } from './services/payment-processing.service';

// strategies
import { BusTicketPaymentResultProcessingStrategy } from './strategies/bus-ticket-payment-processing.strategy';
import { PlaneTicketPaymentProcessingStrategy } from './strategies/plane-ticket-payment-processing.strategy';
import { HotelBookingPaymentProcessingStrategy } from './strategies/hotel-booking-payment-processing.strategy';
import { WalletRechargePaymentProcessingStrategy } from './strategies/wallet-recharge-payment-processing.strategy';
import { ImmediateSuccessPaymentStrategy } from './strategies/bus-ticket/immediate-success-payment.strategy';
import { PendingPaymentProcessingStrategy } from './strategies/bus-ticket/pending-payment-processing.strategy';

// factories
import { PaymentProcessingFactory } from './factories/payment-processing.factory';

// repositories
import { UsersRepository } from '@app/modules/users/users.repository';
import { TransactionsRepository } from '@app/modules/transactions/transactions.repository';
import { BusTicketOrdersRepository } from '@app/modules/orders/bus-ticket/bus-ticket-orders.repository';
import { PlaneTicketOrdersRepository } from '@app/modules/orders/plane-ticket/plane-ticket-orders.repository';
import { HotelBookingOrdersRepository } from '@app/modules/orders/hotel-booking/hotel-booking-orders.repository';
import { WalletRechargeOrdersRepository } from '@app/modules/orders/wallet-recharge-order/wallet-recharge-order.repository';
import { WalletsRepository } from '@app/modules/wallets/wallets.repository';

// enums
import { PaymentProvider } from '@app/common/enums';

@Module({
  imports: [
    PaymentProviderModule,
    TicketProviderModule,
    HotelProviderModule,
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
  controllers: [PaymentStartController, PaymentProcessingController],
  providers: [
    PaymentProcessingFactory,
    PaymentProcessingService,
    BusTicketPaymentResultProcessingStrategy,
    PendingPaymentProcessingStrategy,
    ImmediateSuccessPaymentStrategy,
    PlaneTicketPaymentProcessingStrategy,
    HotelBookingPaymentProcessingStrategy,
    WalletRechargePaymentProcessingStrategy,
    TransactionStatusService,
    BusTicketStartPaymentService,
    PlaneTicketStartPaymentService,
    HotelBookingStartPaymentService,
    WalletRechargeStartPaymentService,
    BusTicketOrdersRepository,
    PlaneTicketOrdersRepository,
    HotelBookingOrdersRepository,
    WalletRechargeOrdersRepository,
    WalletsRepository,
    TransactionsRepository,
    UsersRepository,
  ],
})
export class PaymentModule {}
