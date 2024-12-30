import { Module } from '@nestjs/common';

// services
import { GarantiCardService } from './services/garanti-card.service';

@Module({
  providers: [GarantiCardService],
  exports: [GarantiCardService],
})
export class GarantiPaymentProviderModule {}
