import {
  BankCardPaymentDto,
  PaymentStartDto,
} from '../../dto/payment-start.dto';

export class BiletAllPaymentStartDto extends PaymentStartDto {
  paymentMethod: BankCardPaymentDto;
}
