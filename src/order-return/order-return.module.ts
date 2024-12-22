import { Module } from '@nestjs/common';

// services
import { OrderReturnValidationService } from './services/order-return-validation.service';
import { OrderReturnStartService } from './services/order-return-start.service';
import { VerificationService } from '@app/modules/verification/verification.service';
import { OrderReturnFinishService } from './services/order-return-finish.service';
import { OrderRepositoryFactoryService } from './factories/order-repository.factory.service';
import { OrderEntityFactoryService } from './factories/order-entity.factory.service';

// repositories
import { VerificationsRepository } from '@app/modules/verification/verification.repository';
import { BusTicketOrdersRepository } from '@app/modules/orders/bus-ticket/bus-ticket-orders.repository';
import { PlaneTicketOrdersRepository } from '@app/modules/orders/plane-ticket/plane-ticket-orders.repository';
import { HotelBookingOrdersRepository } from '@app/modules/orders/hotel-booking/hotel-booking-orders.repository';

// controllers
import { OrderReturnController } from './order-return.controller';

// modules
import { PaymentProviderModule } from '@app/providers/payment/provider.module';
import { TicketProviderModule } from '@app/providers/ticket/provider.module';
import { HotelProviderModule } from '@app/providers/hotel/provider.module';

@Module({
  imports: [PaymentProviderModule, TicketProviderModule, HotelProviderModule],
  providers: [
    OrderReturnValidationService,
    OrderReturnStartService,
    OrderReturnFinishService,
    OrderRepositoryFactoryService,
    OrderEntityFactoryService,
    BusTicketOrdersRepository,
    PlaneTicketOrdersRepository,
    HotelBookingOrdersRepository,
    VerificationsRepository,
    VerificationService,
  ],
  controllers: [OrderReturnController],
})
export class OrderReturnModule {}
