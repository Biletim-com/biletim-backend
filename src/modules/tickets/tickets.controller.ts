import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PnrSearchRequestDto } from './dto/tickets-pnr-search.dto';
import { TicketsService } from './tickets.service';
import { PnrSearchBusDto } from './dto/tickets-pnr-search-bus.dto';
import { PnrSearchDomesticFlightDto } from './dto/tickets-pnr-search-domestic-flight.dto';
import { PnrSearchAbroadFlightDto } from './dto/tickets-pnr-search-abroad-flight.dto';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('pnr-search')
  async pnrSearch(
    @Body() requestDto: PnrSearchRequestDto,
  ): Promise<
    PnrSearchBusDto | PnrSearchDomesticFlightDto | PnrSearchAbroadFlightDto
  > {
    return this.ticketsService.pnrSearch(requestDto);
  }
}
