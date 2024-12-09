import { Injectable } from '@nestjs/common';

// services
import { TicketConfigService } from '@app/configs/ticket';
import { BiletAllRequestService } from '../../services/biletall-request.service';
import { BiletAllTravelCountryCodeParserService } from '../parsers/biletall-travel-country-code.parser.service';

// dto
import { CountryDto } from '../dto/travel-country-code.dto';

// types
import { TravelCountryCodeResponse } from '../types/tickets-travel-country-code.type';

@Injectable()
export class BiletAllTravelCountryCodeService {
  private readonly biletAllRequestService: BiletAllRequestService;
  constructor(
    ticketConfigService: TicketConfigService,
    private readonly biletAllTravelCountryCodeParserService: BiletAllTravelCountryCodeParserService,
  ) {
    this.biletAllRequestService = new BiletAllRequestService(
      ticketConfigService.biletAllBaseUrl,
      ticketConfigService.biletAllUsername,
      ticketConfigService.biletAllPassword,
    );
  }

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
