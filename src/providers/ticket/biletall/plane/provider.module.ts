import { Module } from '@nestjs/common';

// service
import { BiletAllParserService } from '../services/biletall-response-parser.service';
import { BiletAllPlaneSearchService } from './services/biletall-plane-search.service';
import { BiletAllPlaneTicketPurchaseService } from './services/biletall-plane-ticket-purchase.service';
import { BiletAllPlaneSearchParserService } from './parsers/biletall-plane-search.parser.service';
import { BiletAllPlaneTicketPurchaseParserService } from './parsers/biletall-plane-ticket-purchase.parser.service';
import { BiletAllPlaneTicketReturnParserService } from './parsers/biletall-plane-ticket-return.parser.service';
import { BiletAllPlaneTicketReturnService } from './services/biletall-plane-ticket-return.service';

@Module({
  providers: [
    BiletAllParserService,
    BiletAllPlaneSearchService,
    BiletAllPlaneTicketPurchaseService,
    BiletAllPlaneTicketReturnService,
    BiletAllPlaneSearchParserService,
    BiletAllPlaneTicketPurchaseParserService,
    BiletAllPlaneTicketReturnParserService,
  ],
  exports: [
    BiletAllPlaneSearchService,
    BiletAllPlaneTicketPurchaseService,
    BiletAllPlaneTicketReturnService,
    BiletAllPlaneSearchParserService,
    BiletAllPlaneTicketPurchaseParserService,
    BiletAllPlaneTicketReturnParserService,
  ],
})
export class BiletAllPlaneModule {}
