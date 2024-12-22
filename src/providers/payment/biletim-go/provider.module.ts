import { Module } from '@nestjs/common';
import { BiletimGoPaymentStrategy } from './biletim-go-payment.strategy';

@Module({
  providers: [BiletimGoPaymentStrategy],
  exports: [BiletimGoPaymentStrategy],
})
export class BiletimGoPaymentProviderModule {}
