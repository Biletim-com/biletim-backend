import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { BiletAllPnrService } from './services/biletall/biletall-pnr.service';
import { BiletAllOfficialHolidaysService } from './services/biletall/biletall-official-holidays.service';
// dto
import { PnrSearchRequestDto } from './services/biletall/dto/tickets-pnr-search.dto';
import { PnrSearchDomesticFlightDto } from './services/biletall/dto/tickets-pnr-search-domestic-flight.dto';
import { PnrSearchAbroadFlightDto } from './services/biletall/dto/tickets-pnr-search-abroad-flight.dto';
import { PnrSearchBusDto } from './services/biletall/dto/tickets-pnr-search-bus.dto';
import {
  OfficialHolidaysDto,
  OfficialHolidaysRequestDto,
} from './services/biletall/dto/get-official-holidays.dto';
import { TravelCountryCodeService } from './services/biletall/biletall-travel-country-code.service';
import { CountryDto } from './services/biletall/dto/travel-country-code.dto';

@ApiTags('Tickets')
@Controller()
export class TicketsController {
  constructor(
    private readonly biletAllPnrService: BiletAllPnrService,
    private readonly biletAllOfficialHolidaysService: BiletAllOfficialHolidaysService,
    private readonly travelCountryCodeService: TravelCountryCodeService,
  ) {}

  @Post('tickets/pnr-search')
  @ApiOperation({ summary: 'Ticket PNR Search' })
  async pnrSearch(
    @Body() requestDto: PnrSearchRequestDto,
  ): Promise<
    PnrSearchBusDto | PnrSearchDomesticFlightDto | PnrSearchAbroadFlightDto
  > {
    return this.biletAllPnrService.pnrSearch(requestDto);
  }

  @Get('official-holidays')
  @ApiOperation({ summary: 'Get official holidays for a given year' })
  async getOfficialHolidays(
    @Query() requestDto: OfficialHolidaysRequestDto,
  ): Promise<OfficialHolidaysDto[]> {
    return this.biletAllOfficialHolidaysService.getOfficialHolidays(requestDto);
  }

  @Get('travel-country-code')
  @ApiOperation({
    summary:
      'Get travel country code to fill in the passport code at payments ',
  })
  async getTravelCountryCode(): Promise<CountryDto[]> {
    return this.travelCountryCodeService.getTravelCountryCode();
  }
}
