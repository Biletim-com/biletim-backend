import { Injectable } from '@nestjs/common';
import { PnrSearchRequestDto } from './dto/tickets-pnr-search.dto';
import * as xml2js from 'xml2js';
import { PnrSearchBusResponse } from './type/tickets-pnr-search-bus-response.type';
import { PnrSearchDomesticFlightResponse } from './type/tickets-pnr-search-domestic-flight-response.type';
import { PnrSearchAbroadFlightResponse } from './type/tickets-pnr-search-abroad-flight-response.type';
import { TicketsParser } from './tickets.parser';
import { PnrSearchDomesticFlightDto } from './dto/tickets-pnr-search-domestic-flight.dto';
import { PnrSearchAbroadFlightDto } from './dto/tickets-pnr-search-abroad-flight.dto';
import { PnrSearchBusDto } from './dto/tickets-pnr-search-bus.dto';
import { BiletAllBusService } from './bus/services/biletall/biletall-bus.service';
import { BiletAllParser } from './bus/services/biletall/biletall-bus.parser';

@Injectable()
export class TicketsService {
  constructor(
    private readonly biletallBusService: BiletAllBusService,
    private readonly biletAllParser: BiletAllParser,
    private readonly ticketsParser: TicketsParser,
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
    const res = await this.biletallBusService.run<any>(xml);

    const extractedResult: any = await this.biletAllParser.extractResult(res);
    const ticket = extractedResult['Bilet'][0];
    const pnr = ticket['PNR'][0];
    const pnrTip = pnr['PnrTip'].toString();

    if (pnrTip === 'K' || pnrTip === 'M') {
      return this.ticketsParser.parsePnrSearchResponse(
        res as PnrSearchBusResponse,
      );
    } else if (pnrTip === 'T' || pnrTip === 'H' || pnrTip === 'S') {
      return this.ticketsParser.parsePnrSearchResponse(
        res as PnrSearchDomesticFlightResponse,
      );
    } else if (pnrTip === 'G') {
      return this.ticketsParser.parsePnrSearchResponse(
        res as PnrSearchAbroadFlightResponse,
      );
    } else {
      throw new Error(`Invalid PnrTip received: ${pnrTip}`);
    }
  }
}
