import { Module } from '@nestjs/common';

// service
import { BiletAllRequestService } from '../services/biletall-request.service';
import { BiletAllParserService } from '../services/biletall-response-parser.service';
import { BiletAllBusSearchService } from './services/biletall-bus-search.service';
import { BiletAllBusTicketPurchaseService } from './services/biletall-bus-ticket-purchase.service';
import { BiletAllBusSearchParserService } from './parsers/biletall-bus-search.parser.service';
import { BiletAllBusTicketPurchaseParserService } from './parsers/biletall-bus-ticket-purchase.parser.service';

@Module({
  providers: [
    BiletAllRequestService,
    BiletAllParserService,
    BiletAllBusSearchService,
    BiletAllBusTicketPurchaseService,
    BiletAllBusSearchParserService,
    BiletAllBusTicketPurchaseParserService,
  ],
  exports: [
    BiletAllBusSearchService,
    BiletAllBusTicketPurchaseService,
    BiletAllBusSearchParserService,
    BiletAllBusTicketPurchaseParserService,
  ],
})
export class BiletAllBusModule {}
