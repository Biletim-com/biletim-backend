import { Module } from '@nestjs/common';

// service
import { BiletAllRequestService } from '../services/biletall-request.service';
import { BiletAllParserService } from '../services/biletall-response-parser.service';
import { BiletAllPlaneSearchService } from './services/biletall-plane-search.service';
import { BiletAllPlaneTicketPurchaseService } from './services/biletall-plane-ticket-purchase.service';
import { BiletAllPlaneSearchParserService } from './parsers/biletall-plane-search.parser.service';
import { BiletAllPlaneTicketPurchaseParserService } from './parsers/biletall-plane-ticket-purchase.parser.service';

@Module({
  providers: [
    BiletAllRequestService,
    BiletAllParserService,
    BiletAllPlaneSearchService,
    BiletAllPlaneTicketPurchaseService,
    BiletAllPlaneSearchParserService,
    BiletAllPlaneTicketPurchaseParserService,
  ],
  exports: [
    BiletAllPlaneSearchService,
    BiletAllPlaneTicketPurchaseService,
    BiletAllPlaneSearchParserService,
    BiletAllPlaneTicketPurchaseParserService,
  ],
})
export class BiletAllPlaneModule {}
