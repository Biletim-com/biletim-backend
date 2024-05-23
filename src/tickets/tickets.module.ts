import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { BiletallModule } from './biletall/biletall.module';

@Module({
  imports: [BiletallModule],
  providers: [TicketsService],
  controllers: [TicketsController],
})
export class TicketsModule {}
