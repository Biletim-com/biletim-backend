import { Injectable } from '@nestjs/common';

// services
import { BiletAllRequestService } from '../../services/biletall-request.service';
import { BiletAllTravelCountryCodeParserService } from '../parsers/biletall-travel-country-code.parser.service';

// dto
import { CountryDto } from '../dto/travel-country-code.dto';

// types
import { TravelCountryCodeResponse } from '../types/tickets-travel-country-code.type';

@Injectable()
export class BiletAllTravelCountryCodeService {
  constructor(
    private readonly biletAllRequestService: BiletAllRequestService,
    private readonly biletAllTravelCountryCodeParserService: BiletAllTravelCountryCodeParserService,
  ) {}

  async getTravelCountryCode(): Promise<CountryDto[]> {
    const travelCountryXml = `<SeyahatUlkeGetirKomut/> `;
    const res =
      await this.biletAllRequestService.run<TravelCountryCodeResponse>(
        travelCountryXml,
      );

    return this.biletAllTravelCountryCodeParserService.parseTravelCountryCode(
      res,
    );
  }
}
