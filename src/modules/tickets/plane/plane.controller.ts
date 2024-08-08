import { Body, Controller, Get, Post } from '@nestjs/common';
import { BiletallPlaneService } from './services/biletall/biletall-plane.service';
import { PlaneAirportDto } from './dto/plane-airport.dto';
import {
  DomesticFlightScheduleDto,
  PlaneDomesticFlightScheduleRequestDto,
} from './dto/plane-domestic-flight-schedule.dto';

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
}
