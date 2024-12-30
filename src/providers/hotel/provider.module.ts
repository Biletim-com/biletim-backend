import { Module } from '@nestjs/common';
import { RatehawkProviderModule } from './ratehawk/provider.module';

@Module({
  imports: [RatehawkProviderModule],
  exports: [RatehawkProviderModule],
})
export class HotelProviderModule {}
