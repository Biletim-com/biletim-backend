import { Injectable } from '@nestjs/common';

// services
import { BiletAllParserService } from '../../services/biletall-response-parser.service';

// dto
import { CountryDto } from '../dto/travel-country-code.dto';

// types
import {
  Country,
  TravelCountryCodeResponse,
} from '../types/tickets-travel-country-code.type';

// utils
import { ObjectTyped } from '@app/common/utils';

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
