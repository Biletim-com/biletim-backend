import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// service
import { OrdersRepository } from '@app/modules/orders/orders.repository';
import { BiletAllPnrService } from '@app/providers/ticket/biletall/common/services/biletall-pnr.service';
import { BiletAllOfficialHolidaysService } from '@app/providers/ticket/biletall/common/services/biletall-official-holidays.service';
import { BiletAllTravelCountryCodeService } from '@app/providers/ticket/biletall/common/services/biletall-travel-country-code.service';
import { PlaneTicketOutputHandlerService } from './services/plane-ticket-output-handler.service';

// entities
import { Order } from '../orders/order.entity';

// dto request
import { PnrSearchRequestDto } from './dto/tickets-pnr-search.dto';
import { OfficialHolidaysRequestDto } from './dto/get-official-holidays.dto';

// dto response
import { CountryDto } from '@app/providers/ticket/biletall/common/dto/travel-country-code.dto';
import { OfficialHolidaysDto } from '@app/providers/ticket/biletall/common/dto/get-official-holidays.dto';
import { PnrSearchAbroadFlightDto } from '@app/providers/ticket/biletall/common/dto/tickets-pnr-search-abroad-flight.dto';
import { PnrSearchBusDto } from '@app/providers/ticket/biletall/common/dto/tickets-pnr-search-bus.dto';
import { PnrSearchDomesticFlightDto } from '@app/providers/ticket/biletall/common/dto/tickets-pnr-search-domestic-flight.dto';

@ApiTags('Tickets')
@Controller()
export class TicketsController {
  constructor(
    private readonly biletAllPnrService: BiletAllPnrService,
    private readonly biletAllOfficialHolidaysService: BiletAllOfficialHolidaysService,
    private readonly biletAllTravelCountryCodeService: BiletAllTravelCountryCodeService,
    private readonly planeTicketOutputHandlerService: PlaneTicketOutputHandlerService,
    private readonly orderRepository: OrdersRepository,
  ) {}

  @Post('tickets/pnr-search')
  @ApiOperation({ summary: 'Ticket PNR Search' })
  async pnrSearch(
    @Body() requestDto: PnrSearchRequestDto,
  ): Promise<
    PnrSearchBusDto | PnrSearchDomesticFlightDto | PnrSearchAbroadFlightDto
  > {
    /**
     * TEMP ORDER
     */
    const order = await this.orderRepository.findOne({
      where: {
        id: '7ba00a14-e3df-411a-97e7-e18e165e4425',
      },
      relations: {
        planeTickets: {
          passenger: true,
          segments: {
            departureAirport: true,
            arrivalAirport: true,
          },
        },
      },
    });
    if (!order) {
      throw new Error();
    }

    this.planeTicketOutputHandlerService.handlePlaneTicketOutputGeneration(
      new Order({
        ...order,
        userEmail: 'bahyeddin@gmail.com',
      }),
    );
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
    return this.biletAllTravelCountryCodeService.getTravelCountryCode();
  }
}
