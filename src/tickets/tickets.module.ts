import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { BiletAllModule } from './biletall/biletall.module';

@Module({
  imports: [BiletAllModule],
  providers: [TicketsService],
  controllers: [TicketsController],
})
export class TicketsModule {}
