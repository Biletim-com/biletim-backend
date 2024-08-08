import { Body, Controller, Get, Post } from '@nestjs/common';
import { BiletallPlaneService } from './services/biletall/biletall-plane.service';
import { PlaneAirPointDto } from './dto/plane-air-points.dto';
import {
  DomesticFlightScheduleDto,
  PlaneDomesticFlightScheduleRequestDto,
} from './dto/plane-domestic-flight-schedule.dto';

@Controller('plane')
export class PlaneController {
  constructor(private readonly biletallPlaneService: BiletallPlaneService) {}

  @Get('air-point-search')
  async airPointSearch(): Promise<PlaneAirPointDto[]> {
    return this.biletallPlaneService.airPointSearch();
  }

  @Post('domestic-flight-schedule')
  async domesticFlightScheduleSearch(
    @Body() requestDto: PlaneDomesticFlightScheduleRequestDto,
  ): Promise<DomesticFlightScheduleDto> {
    return this.biletallPlaneService.domesticFlightScheduleSearch(requestDto);
  }
}
