import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';

// services
import { TicketConfigService } from '@app/configs/ticket';
import { BiletAllRequestService } from '../../services/biletall-request.service';
import { BiletAllPlaneTicketReturnParserService } from '../parsers/biletall-plane-ticket-return.parser.service';

// dtos
import { PlaneTicketReturnPenaltyDto } from '../dto/plane-ticket-return-penalty.dto';
import { PlaneTicketReturnDto } from '../dto/plane-ticket-return.dto';

// types
import { PlaneTicketReturnPenaltyResponse } from '../types/bilatall-plane-ticket-return-penalty.type';
import { PlaneTicketReturnResponse } from '../types/bilatall-plane-ticket-return.type';

@Injectable()
export class BiletAllPlaneTicketReturnService {
  private readonly biletAllRequestService: BiletAllRequestService;
  constructor(
    ticketConfigService: TicketConfigService,
    private readonly biletAllPlaneTicketReturnParserService: BiletAllPlaneTicketReturnParserService,
  ) {
    this.biletAllRequestService = new BiletAllRequestService(
      ticketConfigService.biletAllExtraBaseUrl,
      ticketConfigService.biletAllExtraUsername,
      ticketConfigService.biletAllExtraPassword,
    );
  }

  public async ticketReturnPenalty(
    pnrNumber: string,
    passengerLastName: string,
  ): Promise<PlaneTicketReturnPenaltyDto> {
    const builder = new xml2js.Builder({
      headless: true,
      renderOpts: { pretty: false },
    });
    const requestDocument = {
      SatisIptalCezaGetirKomut: {
        Pnr: {
          PnrNo: pnrNumber,
          PnrAramaParametre: passengerLastName,
        },
      },
    };

    const xml = builder.buildObject(requestDocument);
    const res =
      await this.biletAllRequestService.run<PlaneTicketReturnPenaltyResponse>(
        xml,
      );
    return this.biletAllPlaneTicketReturnParserService.parseReturnPlaneTicketPenalty(
      res,
    );
  }

  public async returnPlaneTicket(
    pnrNumber: string,
    passengerLastName: string,
    refundAmount: string,
  ): Promise<PlaneTicketReturnDto> {
    const builder = new xml2js.Builder({
      headless: true,
      renderOpts: { pretty: false },
    });
    const requestDocument = {
      SatisIptalKomut: {
        Pnr: {
          PnrNo: pnrNumber,
          PnrAramaParametre: passengerLastName,
          SatisIptalTutar: refundAmount,
        },
      },
    };

    const xml = builder.buildObject(requestDocument);
    const res =
      await this.biletAllRequestService.run<PlaneTicketReturnResponse>(xml);
    return this.biletAllPlaneTicketReturnParserService.parseReturnPlaneTicket(
      res,
    );
  }
}
