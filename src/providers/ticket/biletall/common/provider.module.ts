import { Module } from '@nestjs/common';

// service
import { BiletAllRequestService } from '../services/biletall-request.service';
import { BiletAllParserService } from '../services/biletall-response-parser.service';

import { BiletAllPnrService } from './services/biletall-pnr.service';
import { BiletAllOfficialHolidaysService } from './services/biletall-official-holidays.service';
import { BiletAllTravelCountryCodeService } from './services/biletall-travel-country-code.service';

import { BiletAllPnrParserService } from './parsers/biletall-pnr-parser.service';
import { BiletAllOfficialHolidaysParserService } from './parsers/biletall-official-holidays.parser.service';
import { BiletAllTravelCountryCodeParserService } from './parsers/biletall-travel-country-code.parser.service';

@Module({
  providers: [
    BiletAllRequestService,
    BiletAllParserService,
    BiletAllPnrService,
    BiletAllOfficialHolidaysService,
    BiletAllTravelCountryCodeService,
    BiletAllPnrParserService,
    BiletAllOfficialHolidaysParserService,
    BiletAllTravelCountryCodeParserService,
  ],
  exports: [
    BiletAllPnrService,
    BiletAllOfficialHolidaysService,
    BiletAllTravelCountryCodeService,
    BiletAllPnrParserService,
    BiletAllOfficialHolidaysParserService,
    BiletAllTravelCountryCodeParserService,
  ],
})
export class BiletAllCommonModule {}
