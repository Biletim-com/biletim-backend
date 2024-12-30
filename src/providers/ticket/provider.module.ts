import { Module } from '@nestjs/common';
import { BiletAllTicketProvider } from './biletall/provider.module';

@Module({
  imports: [BiletAllTicketProvider],
  exports: [BiletAllTicketProvider],
})
export class TicketProviderModule {}
