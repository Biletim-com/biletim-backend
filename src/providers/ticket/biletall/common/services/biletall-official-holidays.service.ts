import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';

// services
import { TicketConfigService } from '@app/configs/ticket';
import { BiletAllRequestService } from '../../services/biletall-request.service';
import { BiletAllOfficialHolidaysParserService } from '../parsers/biletall-official-holidays.parser.service';

// dto
import {
  OfficialHolidaysDto,
  OfficialHolidaysRequestDto,
} from '../dto/get-official-holidays.dto';

// types
import { OfficialHolidaysResponse } from '../types/get-official-holidays.type';

@Injectable()
export class BiletAllOfficialHolidaysService {
  private readonly biletAllRequestService: BiletAllRequestService;
  constructor(
    ticketConfigService: TicketConfigService,
    private readonly biletAllOfficialHolidaysParserService: BiletAllOfficialHolidaysParserService,
  ) {
    this.biletAllRequestService = new BiletAllRequestService(
      ticketConfigService.biletAllBaseUrl,
      ticketConfigService.biletAllUsername,
      ticketConfigService.biletAllPassword,
    );
  }

  async getOfficialHolidays(
    requestDto: OfficialHolidaysRequestDto,
  ): Promise<OfficialHolidaysDto[]> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      ResmiTatilGunleri: {
        Yil: requestDto.year,
      },
    };
    const xml = builder.buildObject(requestDocument);
    const res = await this.biletAllRequestService.run<OfficialHolidaysResponse>(
      xml,
    );
    return this.biletAllOfficialHolidaysParserService.parseOfficialHolidays(
      res,
    );
  }
}
