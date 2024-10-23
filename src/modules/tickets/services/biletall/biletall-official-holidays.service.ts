import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';
import {
  OfficialHolidaysDto,
  OfficialHolidaysRequestDto,
} from '../../dto/get-official-holidays.dto';
import { BiletAllService } from '@app/common/services';
import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';
import { OfficialHolidaysResponse } from './type/get-official-holidays.type';
import { BiletAllOfficialHolidaysParserService } from './biletall-official-holidays.parser';

@Injectable()
export class BiletAllOfficialHolidaysService extends BiletAllService {
  constructor(
    biletAllApiConfigService: BiletAllApiConfigService,
    private readonly biletAllOfficialHolidaysParserService: BiletAllOfficialHolidaysParserService,
  ) {
    super(biletAllApiConfigService);
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
    const res = await this.run<OfficialHolidaysResponse>(xml);
    return this.biletAllOfficialHolidaysParserService.parseOfficialHolidays(
      res,
    );
  }
}
