import { Module } from '@nestjs/common';

// provider
import { VakifBankPaymentProviderModule } from './vakif-bank/provider.module';
import { BiletAllPaymentProviderModule } from './biletall/provider.module';

// services
import { PaymentProviderFactory } from './payment-provider.factory';

@Module({
  imports: [VakifBankPaymentProviderModule, BiletAllPaymentProviderModule],
  providers: [PaymentProviderFactory],
  exports: [PaymentProviderFactory],
})
export class PaymentProviderModule {}
