import { PaymentStart3DSAuthorizationDto } from '../dto/payment-start.dto';
import { PaymentFinishDto } from '../dto/payment-finish.dto';
import { CancelPaymentDto } from '../dto/cancel-payment.dto';
import { RefundPaymentDto } from '../dto/refund-payment.dto';

export interface IPayment {
  start3DSAuthorization(
    paymentStartDto: PaymentStart3DSAuthorizationDto,
  ): Promise<string | null>;
  finishPayment(paymentFinishDto: PaymentFinishDto): Promise<any>;
  cancelPayment(cancelPaymentDto: CancelPaymentDto): Promise<any>;
  refundPayment(refundPaymentDto: RefundPaymentDto): Promise<any>;
}
