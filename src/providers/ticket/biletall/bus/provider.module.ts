import { Module } from '@nestjs/common';

// service
import { BiletAllParserService } from '../services/biletall-response-parser.service';
import { BiletAllBusSearchService } from './services/biletall-bus-search.service';
import { BiletAllBusTicketPurchaseService } from './services/biletall-bus-ticket-purchase.service';
import { BiletAllBusSearchParserService } from './parsers/biletall-bus-search.parser.service';
import { BiletAllBusTicketPurchaseParserService } from './parsers/biletall-bus-ticket-purchase.parser.service';
import { BiletAllBusTicketReturnService } from './services/biletall-bus-ticket-return.service';
import { BiletAllBusTicketReturnParserService } from './parsers/biletall-bus-ticket-return.parser.service';

@Module({
  providers: [
    BiletAllParserService,
    BiletAllBusSearchService,
    BiletAllBusTicketPurchaseService,
    BiletAllBusTicketReturnService,
    BiletAllBusSearchParserService,
    BiletAllBusTicketPurchaseParserService,
    BiletAllBusTicketReturnParserService,
  ],
  exports: [
    BiletAllBusSearchService,
    BiletAllBusTicketPurchaseService,
    BiletAllBusTicketReturnService,
    BiletAllBusSearchParserService,
    BiletAllBusTicketPurchaseParserService,
    BiletAllBusTicketReturnParserService,
  ],
})
export class BiletAllBusModule {}
