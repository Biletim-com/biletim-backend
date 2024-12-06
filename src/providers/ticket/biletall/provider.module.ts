import { Module } from '@nestjs/common';
import { BiletAllBusModule } from './bus/provider.module';
import { BiletAllPlaneModule } from './plane/provider.module';

@Module({
  imports: [BiletAllBusModule, BiletAllPlaneModule],
})
export class BiletAllTicketProvider {}
