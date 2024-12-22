import {
  BankCardPaymentDto,
  PaymentStartDto,
} from '../../dto/payment-start.dto';

export class VakifBankPaymentStartDto extends PaymentStartDto {
  paymentMethod: BankCardPaymentDto;
}
