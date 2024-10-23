import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PnrSearchRequestDto } from './dto/tickets-pnr-search.dto';
import { PnrSearchBusDto } from './dto/tickets-pnr-search-bus.dto';
import { PnrSearchDomesticFlightDto } from './dto/tickets-pnr-search-domestic-flight.dto';
import { PnrSearchAbroadFlightDto } from './dto/tickets-pnr-search-abroad-flight.dto';
import { BiletAllPnrService } from './services/biletall/biletall-pnr.service';
import {
  OfficialHolidaysDto,
  OfficialHolidaysRequestDto,
} from './dto/get-official-holidays.dto';
import { BiletAllOfficialHolidaysService } from './services/biletall/biletall-official-holidays.service';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly biletAllPnrService: BiletAllPnrService,
    private readonly biletAllOfficialHolidaysService: BiletAllOfficialHolidaysService,
  ) {}

  @Post('pnr-search')
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
}
