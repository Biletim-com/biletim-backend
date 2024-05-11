import { Module } from '@nestjs/common';
import { TıcketsService } from './tıckets/tıckets.service';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { BiletallService } from './biletall/biletall.service';

@Module({
  providers: [TıcketsService, TicketsService, BiletallService],
  controllers: [TicketsController]
})
export class TicketsModule {}
