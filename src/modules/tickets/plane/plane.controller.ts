import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BiletAllPlaneService } from './services/biletall/biletall-plane.service';
import { DomesticFlightScheduleDto } from './dto/plane-domestic-flight-schedule.dto';
import { AbroadFlightScheduleDto } from './dto/plane-abroad-flight-schedule.dto';
import {
  PlanePullPriceFlightDto,
  PullPriceFlightRequestDto,
} from './dto/plane-pull-price-flight.dto';
import { PlanePassengerAgeRuleDto } from './dto/plane-company-passenger-age-rule.dto';
import {
  FlightReservationRequestDto,
  FlightTicketReservationDto,
} from './dto/plane-ticket-reservation.dto';
import {
  FlightTicketPurchaseDto,
  FlightTicketPurchaseRequestDto,
} from './dto/plane-ticket-purchase.dto';
import { FlightConvertReservationToSaleRequestDto } from './dto/plane-convert-reservation-to-sale.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Airport } from './entities/airport.entity';
import { PlaneService } from './services/plane.service';
import { AirportSearchQueryDto } from './dto/airport-search-query.dto';
import { PlaneFlightScheduleRequestDto } from './dto/plane-flight-schedule.dto';
import { PullAbroadFlightPricePackagesRequestDto } from './dto/plane-pull-abroad-flight-price-packages.dto';

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

  @ApiOperation({ summary: 'Search Flight Schedule (Domestic/Abroad)' })
  @Get('flight-schedule')
  async flightScheduleSearch(
    @Query() requestDto: PlaneFlightScheduleRequestDto,
  ): Promise<DomesticFlightScheduleDto | AbroadFlightScheduleDto> {
    if (requestDto.isAbroad) {
      const responseAbroadService =
        this.biletAllPlaneService.abroadFlightScheduleSearch(requestDto);
      return new AbroadFlightScheduleDto(
        (await responseAbroadService).departureFlights,
        (await responseAbroadService)?.returnFlights,
        (await responseAbroadService)?.operationId,
      );
    } else {
      const responseDomesticService =
        this.biletAllPlaneService.domesticFlightScheduleSearch(requestDto);
      return new DomesticFlightScheduleDto(
        (await responseDomesticService).departureFlightsWithFares,
        (await responseDomesticService)?.ReturnFlightsWithFares,
      );
    }
  }

  @ApiOperation({ summary: 'Pull Abroad Flight Price Packages' })
  @Post('pull-abroad-flight-price-packages')
  async pullAbroadFlightPricePackages(
    @Body() requestDto: PullAbroadFlightPricePackagesRequestDto,
  ): Promise<any> {
    return this.biletAllPlaneService.pullAbroadFlightPricePackages(requestDto);
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

  @ApiOperation({ summary: 'Reservation Flight Ticket' })
  // @Post('ticket-reservation')
  async planeTicketReservation(
    @Body() requestDto: FlightReservationRequestDto,
  ): Promise<FlightTicketReservationDto> {
    return this.biletAllPlaneService.planeTicketReservation(requestDto);
  }

  @ApiOperation({ summary: 'Purchase Flight Ticket' })
  // @Post('ticket-purchase')
  async planeTicketPurchase(
    @Body() requestDto: FlightTicketPurchaseRequestDto,
  ): Promise<FlightTicketPurchaseDto> {
    return this.biletAllPlaneService.planeTicketPurchase(requestDto);
  }

  @ApiOperation({ summary: 'Convert Reservation To Sale' })
  // @Post('convert-reservation-to-sale')
  async planeConvertReservationToSale(
    @Body() requestDto: FlightConvertReservationToSaleRequestDto,
  ): Promise<any> {
    return this.biletAllPlaneService.planeConvertReservationToSale(requestDto);
  }
}
