import { UUID } from '@app/common/types';
import { PaymentDetailsDto } from '../../dto/payment-finish.dto';

export class BiletimGoPaymentResultDto extends PaymentDetailsDto {
  amount: string;
  walletId: UUID;
}
