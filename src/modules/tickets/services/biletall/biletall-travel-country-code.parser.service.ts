import { BiletAllParserService } from '@app/common/services';
import { Injectable } from '@nestjs/common';
import {
  Country,
  TravelCountryCodeResponse,
} from './type/tickets-travel-country-code.type';
import { ObjectTyped } from '@app/common/utils';
import { CountryDto } from './dto/travel-country-code.dto';

@Injectable()
export class BiletAllTravelCountryCodeParserService extends BiletAllParserService {
  public parseTravelCountryCode = (
    response: TravelCountryCodeResponse,
  ): CountryDto[] => {
    const extractedResult = this.extractResult(response);
    const travelCountryCodeDataSet = extractedResult['SeyahatUlkeler'][0];
    const countriesDataSet = travelCountryCodeDataSet['Ulke'] ?? [];

    if (!Array.isArray(countriesDataSet)) {
      return [];
    }
    return countriesDataSet.map((entry) => {
      const travelCountryCodeParsed: Country = Object.assign({});

      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        travelCountryCodeParsed[key] = value;
      }
      return new CountryDto(travelCountryCodeParsed);
    });
  };
}
