import { Body, Controller, Get, Post } from '@nestjs/common';
import { BiletallPlaneService } from './services/biletall/biletall-plane.service';
import { PlaneAirportDto } from './dto/plane-airport.dto';
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
import { CompanyPassengerAgeRuleDto } from './dto/plane-company-passanger-age-rule.dto';

@Controller('plane')
export class PlaneController {
  constructor(private readonly biletallPlaneService: BiletallPlaneService) {}

  @Get('airport-search')
  async airportSearch(): Promise<PlaneAirportDto[]> {
    return this.biletallPlaneService.airportSearch();
  }

  @Post('domestic-flight-schedule')
  async domesticFlightScheduleSearch(
    @Body() requestDto: PlaneDomesticFlightScheduleRequestDto,
  ): Promise<DomesticFlightScheduleDto> {
    return this.biletallPlaneService.domesticFlightScheduleSearch(requestDto);
  }

  @Post('abroad-flight-schedule')
  async abroadFlightScheduleSearch(
    @Body() requestDto: PlaneAbroadFlightScheduleRequestDto,
  ): Promise<AbroadFlightScheduleDto> {
    return this.biletallPlaneService.abroadFlightScheduleSearch(requestDto);
  }

  @Post('pull-price')
  async pullPriceOfFlight(
    @Body() requestDto: PullPriceFlightRequestDto,
  ): Promise<PlanePullPriceFlightDto> {
    return this.biletallPlaneService.pullPriceOfFlight(requestDto);
  }

  @Get('company-passanger-age-rules')
  async companyPassangerAgeRules(): Promise<CompanyPassengerAgeRuleDto[]> {
    return this.biletallPlaneService.companyPassangerAgeRules();
  }
}
