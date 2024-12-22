import { PaymentProvider } from '@app/common/enums';
import { BusTicketPurchaseResultDto } from '@app/providers/ticket/biletall/bus/dto/bus-ticket-purchase-result.dto';
import { VakifBankPaymentResultDto } from '@app/providers/payment/vakif-bank/dto/vakif-bank-payment-result.dto';

type PaymentDetailsProviderMapping = {
  [PaymentProvider.BILET_ALL]: BusTicketPurchaseResultDto;
  [PaymentProvider.VAKIF_BANK]: VakifBankPaymentResultDto;
};

export class PaymentResultDto {
  provider: keyof PaymentDetailsProviderMapping;
  details: PaymentDetailsProviderMapping[keyof PaymentDetailsProviderMapping];

  constructor(
    provider: keyof PaymentDetailsProviderMapping,
    details: PaymentDetailsProviderMapping[typeof provider],
  ) {
    this.provider = provider;
    this.details = details;
  }
}
