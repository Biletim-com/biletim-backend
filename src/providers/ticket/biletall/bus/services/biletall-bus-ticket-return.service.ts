import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';

// services
import { BiletAllRequestService } from '../../services/biletall-request.service';
import { BiletAllBusTicketReturnParserService } from '../parsers/biletall-bus-ticket-return.parser.service';

// dtos
import { BusTicketReturnDto } from '../dto/bus-ticket-return.dto';

// types
import { BusTicketReturnResponse } from '../types/biletall-bus-ticket-return.type';

@Injectable()
export class BiletAllBusTicketReturnService {
  constructor(
    private readonly biletAllRequestService: BiletAllRequestService,
    private readonly biletAllBusTicketReturnParserService: BiletAllBusTicketReturnParserService,
  ) {}

  public async returnBusTicket(pnrNumber: string): Promise<BusTicketReturnDto> {
    const builder = new xml2js.Builder({
      headless: true,
      renderOpts: { pretty: false },
    });
    const requestDocument = {
      PnrIslem: {
        PnrNo: pnrNumber,
        PnrKoltukNo: 0, // return all the tickets
        WebUyeNo: 0, // constant
        PnrIslemTip: 8, // constant
      },
    };

    const xml = builder.buildObject(requestDocument);
    const res = await this.biletAllRequestService.run<BusTicketReturnResponse>(
      xml,
    );
    return this.biletAllBusTicketReturnParserService.parseReturnBusTicket(res);
  }
}
