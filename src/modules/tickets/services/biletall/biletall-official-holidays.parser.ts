import { BiletAllParserService } from '@app/common/services';
import { Injectable } from '@nestjs/common';
import {
  Day,
  OfficialHolidaysResponse,
} from './type/get-official-holidays.type';
import { OfficialHolidaysDto } from '@app/modules/tickets/dto/get-official-holidays.dto';
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
