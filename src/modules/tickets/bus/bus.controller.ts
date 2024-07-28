// src/biletall/biletall.controller.ts

import { Controller, Post, Body, Get } from '@nestjs/common';
import { BiletAllBusService } from './services/biletall/biletall-bus.service';
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

@Controller('bus')
export class BusController {
  constructor(private readonly biletAllBusService: BiletAllBusService) {}

  @Get('company')
  async company(@Body() requestDto: CompanyRequestDto): Promise<any> {
    return this.biletAllBusService.company(requestDto);
  }

  @Get('stop-points')
  async stopPoints() {
    return this.biletAllBusService.stopPoints();
  }

  @Post('schedule-list')
  async scheduleList(@Body() requestDto: ScheduleListRequestDto) {
    return this.biletAllBusService.scheduleList(requestDto);
  }

  @Post('bus-search')
  async busSearch(@Body() requestDto: BusSearchRequestDto) {
    return this.biletAllBusService.busSearch(requestDto);
  }

  @Post('bus-seat-control')
  async busSeatControl(@Body() requestDto: BusSeatControlRequestDto) {
    const result = await this.biletAllBusService.busSeatControl(requestDto);
    return { isAvailable: result };
  }

  @Post('boarding-point')
  async boardingPoint(@Body() requestDto: BoardingPointRequestDto) {
    return this.biletAllBusService.boardingPoint(requestDto);
  }

  @Post('service-information')
  async serviceInformation(@Body() requestDto: ServiceInformationRequestDto) {
    return this.biletAllBusService.serviceInformation(requestDto);
  }

  @Post('sale-request')
  async saleRequest(@Body() requestDto: BusSaleRequestDto) {
    return this.biletAllBusService.saleRequest(requestDto);
  }

  @Post('get-route')
  async getRoute(@Body() requestDto: BusRouteRequestDto) {
    return this.biletAllBusService.getRoute(requestDto);
  }
}
