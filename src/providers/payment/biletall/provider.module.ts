import { Module } from '@nestjs/common';

// services
import { BiletAllPaymentStrategy } from './biletall-payment.strategy';
import { BiletAllBusModule } from '../../ticket/biletall/bus/provider.module';

@Module({
  imports: [BiletAllBusModule],
  providers: [BiletAllPaymentStrategy],
  exports: [BiletAllPaymentStrategy],
})
export class BiletAllPaymentProviderModule {}
