import { UUID } from '@app/common/types';
import { BiletimGoPaymentResultDto } from '@app/providers/payment/biletim-go/dto/biletim-go-payment-result.dto';
import { VakifBankSavedCardPaymentFinishDto } from '@app/providers/payment/vakif-bank/dto/vakif-bank-payment-result.dto';

export type PaymentEventsMap = {
  'payment.bus.finish': [
    string,
    UUID,
    BiletimGoPaymentResultDto | VakifBankSavedCardPaymentFinishDto,
  ];
  'payment.plane.finish': [
    string,
    UUID,
    BiletimGoPaymentResultDto | VakifBankSavedCardPaymentFinishDto,
  ];
  'payment.hotel.finish': [
    string,
    UUID,
    BiletimGoPaymentResultDto | VakifBankSavedCardPaymentFinishDto,
  ];
  'payment.wallet-recharge.finish': [
    string,
    UUID,
    VakifBankSavedCardPaymentFinishDto,
  ];
};
