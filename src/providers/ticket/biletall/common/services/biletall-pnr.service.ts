import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';

// services
import { BiletAllRequestService } from '../../services/biletall-request.service';
import { BiletAllPnrParserService } from '../parsers/biletall-pnr-parser.service';

// dto
import { PnrSearchDomesticFlightDto } from '../dto/tickets-pnr-search-domestic-flight.dto';
import { PnrSearchAbroadFlightDto } from '../dto/tickets-pnr-search-abroad-flight.dto';
import { PnrSearchRequestDto } from '../dto/tickets-pnr-search.dto';
import { PnrSearchBusDto } from '../dto/tickets-pnr-search-bus.dto';

// types
import { PnrSearchResponse } from '../types/tickets-pnr-search-union.type';

@Injectable()
export class BiletAllPnrService {
  constructor(
    private readonly biletallRequestService: BiletAllRequestService,
    private readonly biletAllPnrParserService: BiletAllPnrParserService,
  ) {}

  async pnrSearch(
    requestDto: PnrSearchRequestDto,
  ): Promise<
    PnrSearchBusDto | PnrSearchDomesticFlightDto | PnrSearchAbroadFlightDto
  > {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      PnrIslem: {
        PnrNo: requestDto.pnrNumber,
        PnrIslemTip: 0,
        PnrAramaParametre: requestDto.pnrSearcParameter,
      },
    };
    const xml = builder.buildObject(requestDocument);
    const res = await this.biletallRequestService.run<PnrSearchResponse>(xml);
    return this.biletAllPnrParserService.parsePnrSearchResponse(res);
  }
}
