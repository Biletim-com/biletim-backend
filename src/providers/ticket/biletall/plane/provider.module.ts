import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

// entities
import { Airport } from './entities/airport.entity';

// repositories
import { AirportRepository } from './repositories/airport.repository';

// service
import { BiletAllParserService } from '../services/biletall-response-parser.service';
import { BiletAllPlaneSearchService } from './services/biletall-plane-search.service';
import { BiletAllPlaneTicketPurchaseService } from './services/biletall-plane-ticket-purchase.service';
import { BiletAllPlaneSearchParserService } from './parsers/biletall-plane-search.parser.service';
import { BiletAllPlaneTicketPurchaseParserService } from './parsers/biletall-plane-ticket-purchase.parser.service';
import { BiletAllPlaneTicketReturnParserService } from './parsers/biletall-plane-ticket-return.parser.service';
import { BiletAllPlaneTicketReturnService } from './services/biletall-plane-ticket-return.service';
import { AirportsService } from './services/airports.service';

@Module({
  imports: [PostgreSQLProviderModule.forFeature([Airport])],
  providers: [
    AirportRepository,
    AirportsService,
    BiletAllParserService,
    BiletAllPlaneSearchService,
    BiletAllPlaneTicketPurchaseService,
    BiletAllPlaneTicketReturnService,
    BiletAllPlaneSearchParserService,
    BiletAllPlaneTicketPurchaseParserService,
    BiletAllPlaneTicketReturnParserService,
  ],
  exports: [
    AirportRepository,
    AirportsService,
    BiletAllPlaneSearchService,
    BiletAllPlaneTicketPurchaseService,
    BiletAllPlaneTicketReturnService,
    BiletAllPlaneSearchParserService,
    BiletAllPlaneTicketPurchaseParserService,
    BiletAllPlaneTicketReturnParserService,
  ],
})
export class BiletAllPlaneModule {}
