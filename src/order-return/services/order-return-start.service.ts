import { Injectable } from '@nestjs/common';

// services
import { EventEmitterService } from '@app/providers/event-emitter/provider.service';
import { OrderReturnValidationService } from './order-return-validation.service';
import { VerificationService } from '@app/modules/verification/verification.service';

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
  ): Promise<void> {
    const order =
      await this.orderReturnValidationService.validateOrderWithPnrNumber(
        pnrNumber,
        passengerLastName,
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
