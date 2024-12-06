import { Injectable } from '@nestjs/common';

// services
import { BiletAllParserService } from '../../services/biletall-response-parser.service';

// dto
import { OfficialHolidaysDto } from '../dto/get-official-holidays.dto';

// types
import {
  Day,
  OfficialHolidaysResponse,
} from '../types/get-official-holidays.type';

// utils
import { ObjectTyped } from '@app/common/utils/object-typed.util';

@Injectable()
export class BiletAllOfficialHolidaysParserService extends BiletAllParserService {
  public parseOfficialHolidays = (
    response: OfficialHolidaysResponse,
  ): OfficialHolidaysDto[] => {
    const extractedResult = this.extractResult(response);
    const officialHolidaysDataSet = extractedResult['ResmiTatilGunleri'][0];
    const daysDataSet = officialHolidaysDataSet['Gunler'] ?? [];

    if (!Array.isArray(daysDataSet)) {
      return [];
    }
    return daysDataSet.map((entry) => {
      const officialHolidaysParsed: Day = Object.assign({});

      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        officialHolidaysParsed[key] = value;
      }
      return new OfficialHolidaysDto(officialHolidaysParsed);
    });
  };
}
