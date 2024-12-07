import { Injectable } from '@nestjs/common';

import { VakifBankPaymentResultHandlerStrategy } from '../strategies/vakif-bank-payment-result-handler.strategy';
import { BiletAllPaymentResultHandlerStrategy } from '../strategies/biletall-payment-result-handler.strategy';

// interfaces
import { IPaymentResultHandler } from '../interfaces/payment-result-handler.interface';

// enums
import { PaymentProvider } from '@app/common/enums';

// errors
import { PaymentProviderUnsupported } from '@app/common/errors';

@Injectable()
export class PaymentResultHandlerProviderFactory {
  private readonly strategies: Map<PaymentProvider, IPaymentResultHandler> =
    new Map();

  constructor(
    vakifBankPaymentResultHandlerStrategy: VakifBankPaymentResultHandlerStrategy,
    biletAllPaymentResultHandlerStrategy: BiletAllPaymentResultHandlerStrategy,
  ) {
    this.strategies.set(
      PaymentProvider.VAKIF_BANK,
      vakifBankPaymentResultHandlerStrategy,
    );
    this.strategies.set(
      PaymentProvider.BILET_ALL,
      biletAllPaymentResultHandlerStrategy,
    );
  }

  getStrategy(provider: PaymentProvider): IPaymentResultHandler {
    const strategy = this.strategies.get(provider);
    if (!strategy) {
      throw new PaymentProviderUnsupported(provider);
    }
    return strategy;
  }
}
