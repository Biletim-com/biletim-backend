import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';

// services
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
  constructor(
    private readonly biletallRequestService: BiletAllRequestService,
    private readonly biletAllOfficialHolidaysParserService: BiletAllOfficialHolidaysParserService,
  ) {}

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
    const res = await this.biletallRequestService.run<OfficialHolidaysResponse>(
      xml,
    );
    return this.biletAllOfficialHolidaysParserService.parseOfficialHolidays(
      res,
    );
  }
}
