import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { BiletallService } from './biletall/biletall.service';

@Module({
  providers: [TicketsService, BiletallService],
  controllers: [TicketsController],
})
export class TicketsModule {}
