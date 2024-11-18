import { BiletAllService } from '@app/common/services';
import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';
import { Injectable } from '@nestjs/common';
import { TravelCountryCodeResponse } from './type/tickets-travel-country-code.type';
import { BiletAllTravelCountryCodeParserService } from './biletall-travel-country-code.parser.service';
import { CountryDto } from './dto/travel-country-code.dto';

@Injectable()
export class TravelCountryCodeService extends BiletAllService {
  constructor(
    biletAllApiConfigService: BiletAllApiConfigService,
    private readonly biletAllTravelCountryCodeParserService: BiletAllTravelCountryCodeParserService,
  ) {
    super(biletAllApiConfigService);
  }

  async getTravelCountryCode(): Promise<CountryDto[]> {
    const travelCountryXml = `<SeyahatUlkeGetirKomut/> `;
    const res = await this.run<TravelCountryCodeResponse>(travelCountryXml);

    return this.biletAllTravelCountryCodeParserService.parseTravelCountryCode(
      res,
    );
  }
}
