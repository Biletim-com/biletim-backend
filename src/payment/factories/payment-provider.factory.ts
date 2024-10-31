import { Injectable } from '@nestjs/common';

import { VakifBankPaymentStrategy } from '../providers/vakif-bank/vakif-bank-payment.strategy';

// interfaces
import { IPayment } from '../interfaces/payment.interface';

// enums
import { PaymentProvider } from '@app/common/enums';

// errors
import { PaymentProviderUnsupported } from '@app/common/errors';

@Injectable()
export class PaymentProviderFactory {
  private readonly strategies: Map<PaymentProvider, IPayment> = new Map();

  constructor(vakifBankStrategy: VakifBankPaymentStrategy) {
    this.strategies.set(PaymentProvider.VAKIF_BANK, vakifBankStrategy);
  }

  getStrategy(provider: PaymentProvider): IPayment {
    const strategy = this.strategies.get(provider);
    if (!strategy) {
      throw new PaymentProviderUnsupported(provider);
    }
    return strategy;
  }
}
