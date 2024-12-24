import { UUID } from '@app/common/types';
import { BiletimGoPaymentResultDto } from '@app/providers/payment/biletim-go/dto/biletim-go-payment-result.dto';

export type PaymentEventsMap = {
  'payment.bus.finish': [string, UUID, BiletimGoPaymentResultDto];
  'payment.plane.finish': [string, UUID, BiletimGoPaymentResultDto];
  'payment.hotel.finish': [string, UUID, BiletimGoPaymentResultDto];
};
