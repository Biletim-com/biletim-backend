import { Module } from '@nestjs/common';
import { BiletAllBusModule } from './bus/provider.module';
import { BiletAllPlaneModule } from './plane/provider.module';
import { BiletAllCommonModule } from './common/provider.module';

@Module({
  imports: [BiletAllCommonModule, BiletAllBusModule, BiletAllPlaneModule],
  exports: [BiletAllCommonModule, BiletAllBusModule, BiletAllPlaneModule],
})
export class BiletAllTicketProvider {}
