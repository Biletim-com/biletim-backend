import { Module } from '@nestjs/common';

// provider
import { VakifBankPaymentProviderModule } from './vakif-bank/provider.module';
import { BiletAllPaymentProviderModule } from './biletall/provider.module';
import { GarantiPaymentProviderModule } from './garanti/provider.module';
import { BiletimGoPaymentProviderModule } from './biletim-go/provider.module';

// services
import { PaymentProviderFactory } from './payment-provider.factory';

@Module({
  imports: [
    VakifBankPaymentProviderModule,
    BiletAllPaymentProviderModule,
    GarantiPaymentProviderModule,
    BiletimGoPaymentProviderModule,
  ],
  providers: [PaymentProviderFactory],
  exports: [
    VakifBankPaymentProviderModule,
    BiletAllPaymentProviderModule,
    GarantiPaymentProviderModule,
    BiletimGoPaymentProviderModule,
    PaymentProviderFactory,
  ],
})
export class PaymentProviderModule {}
