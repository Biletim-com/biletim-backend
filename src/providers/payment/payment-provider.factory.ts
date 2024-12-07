import { Injectable } from '@nestjs/common';

import { VakifBankPaymentStrategy } from './vakif-bank/vakif-bank-payment.strategy';
import { BiletAllPaymentStrategy } from './biletall/biletall-payment.strategy';

// interfaces
import { IPayment } from './interfaces/payment.interface';

// enums
import { PaymentProvider } from '@app/common/enums';

// errors
import { PaymentProviderUnsupported } from '@app/common/errors';

@Injectable()
export class PaymentProviderFactory {
  private readonly strategies: Map<PaymentProvider, IPayment> = new Map();

  constructor(
    vakifBankPaymentStrategy: VakifBankPaymentStrategy,
    biletAllPaymentStrategy: BiletAllPaymentStrategy,
  ) {
    this.strategies.set(PaymentProvider.VAKIF_BANK, vakifBankPaymentStrategy);
    this.strategies.set(PaymentProvider.BILET_ALL, biletAllPaymentStrategy);
  }

  getStrategy(provider: PaymentProvider): IPayment {
    const strategy = this.strategies.get(provider);
    if (!strategy) {
      throw new PaymentProviderUnsupported(provider);
    }
    return strategy;
  }
}
