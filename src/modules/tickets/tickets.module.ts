import { Module } from '@nestjs/common';

import { TicketsService } from './services/tickets.service';
import { TicketsController } from './tickets.controller';

// modules
import { BusModule } from './bus/bus.module';
import { PlaneModule } from './plane/plane.module';

// services
import { BiletAllPnrService } from './services/biletall/biletall-pnr.service';
import { BiletAllPnrParserService } from './services/biletall/biletall-pnr-parser.service';
import { BiletAllOfficialHolidaysService } from './services/biletall/biletall-official-holidays.service';
import { BiletAllOfficialHolidaysParserService } from './services/biletall/biletall-official-holidays.parser.service';
import { TravelCountryCodeService } from './services/biletall/biletall-travel-country-code.service';
import { BiletAllTravelCountryCodeParserService } from './services/biletall/biletall-travel-country-code.parser.service';
import { PlaneTicketOutputHandlerService } from './services/plane-ticket-output-handler.service';
import { OrdersRepository } from '../orders/orders.repository';

@Module({
  imports: [BusModule, PlaneModule],
  providers: [
    OrdersRepository,
    PlaneTicketOutputHandlerService,
    TicketsService,
    BiletAllPnrService,
    BiletAllPnrParserService,
    BiletAllOfficialHolidaysService,
    BiletAllOfficialHolidaysParserService,
    TravelCountryCodeService,
    BiletAllTravelCountryCodeParserService,
  ],
  controllers: [TicketsController],
})
export class TicketsModule {}
