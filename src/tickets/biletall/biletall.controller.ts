// src/biletall/biletall.controller.ts

import { Controller, Post, Body, Get } from '@nestjs/common';
import { BiletAllService } from './biletall.service';
import {
  CompanyRequestDto,
  ScheduleListRequestDto,
  BusSearchRequestDto,
  BusSeatControlRequestDto,
  BoardingPointRequestDto,
  ServiceInformationRequestDto,
  BusSaleRequestDto,
  BusRouteRequestDto,
} from './dto/biletall.dto';

@Controller('biletall')
export class BiletAllController {
  constructor(private readonly biletAllService: BiletAllService) {}

  @Post('company')
  async company(@Body() requestDto: CompanyRequestDto) {
    return this.biletAllService.company(requestDto);
  }

  @Get('stop-points')
  async stopPoints() {
    return this.biletAllService.stopPoints();
  }

  @Post('schedule-list')
  async scheduleList(@Body() requestDto: ScheduleListRequestDto) {
    return this.biletAllService.scheduleList(requestDto);
  }

  @Post('bus-search')
  async busSearch(@Body() requestDto: BusSearchRequestDto) {
    return this.biletAllService.busSearch(requestDto);
  }

  @Post('bus-seat-control')
  async busSeatControl(@Body() requestDto: BusSeatControlRequestDto) {
    return this.biletAllService.busSeatControl(requestDto);
  }

  @Post('boarding-point')
  async boardingPoint(@Body() requestDto: BoardingPointRequestDto) {
    return this.biletAllService.boardingPoint(requestDto);
  }

  @Post('service-information')
  async serviceInformation(@Body() requestDto: ServiceInformationRequestDto) {
    return this.biletAllService.serviceInformation(requestDto);
  }

  @Post('sale-request')
  async saleRequest(@Body() requestDto: BusSaleRequestDto) {
    return this.biletAllService.saleRequest(requestDto);
  }

  @Post('get-route')
  async getRoute(@Body() requestDto: BusRouteRequestDto) {
    return this.biletAllService.getRoute(requestDto);
  }
}
