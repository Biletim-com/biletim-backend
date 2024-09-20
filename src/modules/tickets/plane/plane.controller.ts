import { Body, Controller, Get, Post } from '@nestjs/common';
import { BiletallPlaneService } from './services/biletall/biletall-plane.service';
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

@ApiTags('Plane')
@Controller('plane')
export class PlaneController {
  constructor(private readonly biletallPlaneService: BiletallPlaneService) {}

  @ApiOperation({ summary: 'Search Domestic Flight Schedule' })
  @Post('domestic-flight-schedule')
  async domesticFlightScheduleSearch(
    @Body() requestDto: PlaneDomesticFlightScheduleRequestDto,
  ): Promise<DomesticFlightScheduleDto> {
    return this.biletallPlaneService.domesticFlightScheduleSearch(requestDto);
  }

  @ApiOperation({ summary: 'Search Abroad Flight Schedule' })
  @Post('abroad-flight-schedule')
  async abroadFlightScheduleSearch(
    @Body() requestDto: PlaneAbroadFlightScheduleRequestDto,
  ): Promise<AbroadFlightScheduleDto> {
    return this.biletallPlaneService.abroadFlightScheduleSearch(requestDto);
  }

  @ApiOperation({ summary: 'Pull Price Of Flight' })
  @Post('pull-price')
  async pullPriceOfFlight(
    @Body() requestDto: PullPriceFlightRequestDto,
  ): Promise<PlanePullPriceFlightDto> {
    return this.biletallPlaneService.pullPriceOfFlight(requestDto);
  }

  @ApiOperation({ summary: 'Get Plane Passenger Age Rules' })
  @Get('passenger-age-rules')
  async planePassengerAgeRules(): Promise<PlanePassengerAgeRuleDto[]> {
    return this.biletallPlaneService.planePassengerAgeRules();
  }

  @ApiOperation({ summary: 'Reservation Flight Ticket' })
  @Post('ticket-reservation')
  async planeTicketReservation(
    @Body() requestDto: FlightReservationRequestDto,
  ): Promise<FlightTicketReservationDto> {
    return this.biletallPlaneService.planeTicketReservation(requestDto);
  }

  @ApiOperation({ summary: 'Purchase Flight Ticket' })
  @Post('ticket-purchase')
  async planeTicketPurchase(
    @Body() requestDto: FlightTicketPurchaseRequestDto,
  ): Promise<FlightTicketPurchaseDto> {
    return this.biletallPlaneService.planeTicketPurchase(requestDto);
  }

  @ApiOperation({ summary: 'Convert Reservation To Sale' })
  @Post('convert-reservation-to-sale')
  async planeConvertReservationToSale(
    @Body() requestDto: FlightConvertReservationToSaleRequestDto,
  ): Promise<any> {
    return this.biletallPlaneService.planeConvertReservationToSale(requestDto);
  }
}
