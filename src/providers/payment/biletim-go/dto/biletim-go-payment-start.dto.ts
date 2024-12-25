import { PaymentStartDto, WalletPaymentDto } from '../../dto/payment-start.dto';

export class BiletimGoPaymentStartDto extends PaymentStartDto {
  paymentMethod: WalletPaymentDto;
}
