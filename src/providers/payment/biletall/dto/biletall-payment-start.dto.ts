import {
  BankCardPaymentDto,
  PaymentStart3DSAuthorizationDto,
} from '../../dto/payment-start.dto';

export class BiletAllPaymentStart3DSAuthorizationDto extends PaymentStart3DSAuthorizationDto {
  paymentMethod: BankCardPaymentDto;
}
