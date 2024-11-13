import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';

// services
import { BiletAllService } from '@app/common/services';
import { BiletAllPnrParserService } from './biletall-pnr-parser.service';
import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';

// dto
import { PnrSearchDomesticFlightDto } from './dto/tickets-pnr-search-domestic-flight.dto';
import { PnrSearchAbroadFlightDto } from './dto/tickets-pnr-search-abroad-flight.dto';
import { PnrSearchRequestDto } from './dto/tickets-pnr-search.dto';
import { PnrSearchBusDto } from './dto/tickets-pnr-search-bus.dto';

// types
import { PnrSearchResponse } from './type/tickets-pnr-search-union.type';

@Injectable()
export class BiletAllPnrService extends BiletAllService {
  constructor(
    biletAllApiConfigService: BiletAllApiConfigService,
    private readonly biletAllPnrParserService: BiletAllPnrParserService,
  ) {
    super(biletAllApiConfigService);
  }

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
    const res = await this.run<PnrSearchResponse>(xml);
    return this.biletAllPnrParserService.parsePnrSearchResponse(res);
  }
}
