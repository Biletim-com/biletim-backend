import { Module } from '@nestjs/common';

// services
import { OrdersRepository } from '@app/modules/orders/orders.repository';
import { OrderReturnValidationService } from './services/order-return-validation.service';
import { OrderReturnStartService } from './services/order-return-start.service';
import { VerificationService } from '@app/modules/verification/verification.service';
import { OrderReturnFinishService } from './services/order-return-finish.service';
import { VerificationsRepository } from '@app/modules/verification/verification.repository';

import { OrderReturnController } from './order-return.controller';
import { PaymentProviderModule } from '@app/providers/payment/provider.module';
import { BiletAllCommonModule } from '@app/providers/ticket/biletall/common/provider.module';
import { BiletAllPlaneModule } from '@app/providers/ticket/biletall/plane/provider.module';
import { BiletAllBusModule } from '@app/providers/ticket/biletall/bus/provider.module';

@Module({
  imports: [
    PaymentProviderModule,
    BiletAllCommonModule,
    BiletAllPlaneModule,
    BiletAllBusModule,
  ],
  providers: [
    OrderReturnValidationService,
    OrderReturnStartService,
    OrderReturnFinishService,
    OrdersRepository,
    VerificationsRepository,
    VerificationService,
  ],
  controllers: [OrderReturnController],
})
export class OrderReturnModule {}
