import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BiletAllPlaneService } from './services/biletall/biletall-plane.service';
import {
  DomesticFlightScheduleDto,
  PlaneDomesticFlightScheduleRequestDto,
} from './dto/plane-domestic-flight-schedule.dto';
import {
  AbroadFlightScheduleDto,
  PlaneAbroadFlightScheduleRequestDto,
} from './dto/plane-abroad-flight-schedule.dto';
import {
  PlanePullPriceFlightDto,
  PullPriceFlightRequestDto,
} from './dto/plane-pull-price-flight.dto';
import { PlanePassengerAgeRuleDto } from './dto/plane-company-passenger-age-rule.dto';
// import {
//   FlightReservationRequestDto,
//   FlightTicketReservationDto,
// } from './dto/plane-ticket-reservation.dto';
// import {
//   FlightTicketPurchaseDto,
//   FlightTicketPurchaseRequestDto,
// } from './dto/plane-ticket-purchase.dto';
// import { FlightConvertReservationToSaleRequestDto } from './dto/plane-convert-reservation-to-sale.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Airport } from './entities/airport.entity';
import { PlaneService } from './services/plane.service';
import { AirportSearchQueryDto } from './dto/airport-search-query.dto';

@ApiTags('Plane')
@Controller('plane')
export class PlaneController {
  constructor(
    private readonly planeService: PlaneService,
    private readonly biletAllPlaneService: BiletAllPlaneService,
  ) {}

  @ApiOperation({
    summary:
      'Airport search by CountryName, CityName, AirportCode and AirportName',
  })
  @Get('airport-search')
  async busTerminalsByName(
    @Query() { searchText }: AirportSearchQueryDto,
  ): Promise<Airport[]> {
    return this.planeService.searchAirports(searchText);
  }

  @ApiOperation({ summary: 'Search Domestic Flight Schedule' })
  @Post('domestic-flight-schedule')
  async domesticFlightScheduleSearch(
    @Body() requestDto: PlaneDomesticFlightScheduleRequestDto,
  ): Promise<DomesticFlightScheduleDto> {
    return this.biletAllPlaneService.domesticFlightScheduleSearch(requestDto);
  }

  @ApiOperation({ summary: 'Search Abroad Flight Schedule' })
  @Post('abroad-flight-schedule')
  async abroadFlightScheduleSearch(
    @Body() requestDto: PlaneAbroadFlightScheduleRequestDto,
  ): Promise<AbroadFlightScheduleDto> {
    return this.biletAllPlaneService.abroadFlightScheduleSearch(requestDto);
  }

  @ApiOperation({ summary: 'Pull Price Of Flight' })
  @Post('pull-price')
  async pullPriceOfFlight(
    @Body() requestDto: PullPriceFlightRequestDto,
  ): Promise<PlanePullPriceFlightDto> {
    return this.biletAllPlaneService.pullPriceOfFlight(requestDto);
  }

  @ApiOperation({ summary: 'Get Plane Passenger Age Rules' })
  @Get('passenger-age-rules')
  async planePassengerAgeRules(): Promise<PlanePassengerAgeRuleDto[]> {
    return this.biletAllPlaneService.planePassengerAgeRules();
  }

  // @ApiOperation({ summary: 'Reservation Flight Ticket' })
  // @Post('ticket-reservation')
  // async planeTicketReservation(
  //   @Body() requestDto: FlightReservationRequestDto,
  // ): Promise<FlightTicketReservationDto> {
  //   return this.biletAllPlaneService.planeTicketReservation(requestDto);
  // }

  // @ApiOperation({ summary: 'Purchase Flight Ticket' })
  // @Post('ticket-purchase')
  // async planeTicketPurchase(
  //   @Body() requestDto: FlightTicketPurchaseRequestDto,
  // ): Promise<FlightTicketPurchaseDto> {
  //   return this.biletAllPlaneService.planeTicketPurchase(requestDto);
  // }

  // @ApiOperation({ summary: 'Convert Reservation To Sale' })
  // @Post('convert-reservation-to-sale')
  // async planeConvertReservationToSale(
  //   @Body() requestDto: FlightConvertReservationToSaleRequestDto,
  // ): Promise<any> {
  //   return this.biletAllPlaneService.planeConvertReservationToSale(requestDto);
  // }
}
