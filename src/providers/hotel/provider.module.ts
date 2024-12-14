import { Module } from '@nestjs/common';
import { RatehawkProviderModule } from './ratehawk/provider.module';

@Module({ imports: [RatehawkProviderModule] })
export class HotelProviderModule {}
