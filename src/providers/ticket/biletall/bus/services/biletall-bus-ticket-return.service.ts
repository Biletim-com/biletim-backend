import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';

// services
import { TicketConfigService } from '@app/configs/ticket';
import { BiletAllRequestService } from '../../services/biletall-request.service';
import { BiletAllBusTicketReturnParserService } from '../parsers/biletall-bus-ticket-return.parser.service';

// dtos
import { BusTicketReturnDto } from '../dto/bus-ticket-return.dto';

// types
import { BusTicketReturnResponse } from '../types/biletall-bus-ticket-return.type';

@Injectable()
export class BiletAllBusTicketReturnService {
  private readonly biletAllRequestService: BiletAllRequestService;
  constructor(
    ticketConfigService: TicketConfigService,
    private readonly biletAllBusTicketReturnParserService: BiletAllBusTicketReturnParserService,
  ) {
    this.biletAllRequestService = new BiletAllRequestService(
      ticketConfigService.biletAllBaseUrl,
      ticketConfigService.biletAllUsername,
      ticketConfigService.biletAllPassword,
    );
  }

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
