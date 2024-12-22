import { Injectable } from '@nestjs/common';

// interfaces
import { IPayment } from '../interfaces/payment.interface';

// dto
import { BiletimGoPaymentStartDto } from './dto/biletim-go-payment-start.dto';
import { PaymentFinishDto } from '../dto/payment-finish.dto';
import { CancelPaymentDto } from '../dto/cancel-payment.dto';
import { RefundPaymentDto } from '../dto/refund-payment.dto';

@Injectable()
export class BiletimGoPaymentStrategy implements IPayment {
  startPayment(paymentStartDto: BiletimGoPaymentStartDto): Promise<string> {
    throw new Error('Method not implemented.');
  }
  finishPayment(paymentFinishDto: PaymentFinishDto): Promise<any> {
    throw new Error('Method not implemented.');
  }
  cancelPayment(cancelPaymentDto: CancelPaymentDto): Promise<any> {
    throw new Error('Method not implemented.');
  }
  refundPayment(refundPaymentDto: RefundPaymentDto): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
