import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PnrSearchRequestDto } from './dto/tickets-pnr-search.dto';
import { PnrSearchBusDto } from './dto/tickets-pnr-search-bus.dto';
import { PnrSearchDomesticFlightDto } from './dto/tickets-pnr-search-domestic-flight.dto';
import { PnrSearchAbroadFlightDto } from './dto/tickets-pnr-search-abroad-flight.dto';
import { BiletAllPnrService } from './services/biletall/biletall-pnr.service';

@ApiTags('Tickets')
@Controller()
export class TicketsController {
  constructor(private readonly biletAllPnrService: BiletAllPnrService) {}

  @Post('tickets/pnr-search')
  @ApiOperation({ summary: 'Ticket PNR Search' })
  async pnrSearch(
    @Body() requestDto: PnrSearchRequestDto,
  ): Promise<
    PnrSearchBusDto | PnrSearchDomesticFlightDto | PnrSearchAbroadFlightDto
  > {
    return this.biletAllPnrService.pnrSearch(requestDto);
  }
}
