import { Injectable } from '@nestjs/common';

// services
import { EventEmitterService } from '@app/providers/event-emitter/provider.service';
import { OrderReturnValidationService } from './order-return-validation.service';
import { VerificationService } from '@app/modules/verification/verification.service';

// enums
import { OrderType } from '@app/common/enums';

@Injectable()
export class OrderReturnStartService {
  constructor(
    private readonly orderReturnValidationService: OrderReturnValidationService,
    private readonly verificaitonService: VerificationService,
    private readonly eventEmitter: EventEmitterService,
  ) {}

  public async startReturnOrder(
    pnrNumber: string,
    passengerLastName: string,
    orderType: OrderType,
  ): Promise<void> {
    const order = await this.orderReturnValidationService.validateOrder(
      pnrNumber,
      passengerLastName,
      orderType,
    );
    const verificationCode =
      await this.verificaitonService.createOrderCancellationVerificationCode(
        order,
      );

    this.eventEmitter.emitEvent('order.cancel.init', {
      gsmno: order.userPhoneNumber,
      verificationCode: String(verificationCode),
    });
  }
}
