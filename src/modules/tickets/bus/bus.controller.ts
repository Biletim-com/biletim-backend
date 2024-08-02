// src/biletall/biletall.controller.ts

import { Controller, Post, Body, Get, Query } from '@nestjs/common';

// services
import { BiletAllService } from './services/biletall/biletall.service';
import { BusService } from './services/bus.service';

// dto
import { BusCompanyDto } from './dto/bus-company.dto';
import { ScheduleListDto } from './dto/bus-schedule-list.dto';
import { BusSearchDto } from './dto/bus-search.dto';
import { BusSeatControlDto } from './dto/bus-seat-control.dto';
import { BoardingPointDto } from './dto/bus-boarding-point.dto';
import { ServiceInformationDto } from './dto/bus-service-information.dto';
import { BusPurchaseDto } from './dto/bus-purchase.dto';
import { BusRouteDto } from './dto/bus-route.dto';
import { BusTerminalSearchQueryDto } from './dto/bus-terminal-search-query.dto';

@Controller('bus')
export class BusController {
  constructor(
    private readonly biletAllService: BiletAllService,
    private readonly busService: BusService,
  ) {}

  @Get('company')
  async company(@Body() requestDto: BusCompanyDto): Promise<any> {
    return this.biletAllService.company(requestDto);
  }

  @Get('bus-terminal-search')
  async busTerminalsByName(@Query() { name }: BusTerminalSearchQueryDto) {
    return this.busService.getBusTerminalsByName(name);
  }

  @Post('schedule-list')
  async scheduleList(@Body() requestDto: ScheduleListDto) {
    return this.biletAllService.scheduleList(requestDto);
  }

  @Post('bus-search')
  async busSearch(@Body() requestDto: BusSearchDto) {
    return this.biletAllService.busSearch(requestDto);
  }

  @Post('bus-seat-control')
  async busSeatControl(@Body() requestDto: BusSeatControlDto) {
    const result = await this.biletAllService.busSeatControl(requestDto);
    return { isAvailable: result };
  }

  @Post('boarding-point')
  async boardingPoint(@Body() requestDto: BoardingPointDto) {
    return this.biletAllService.boardingPoint(requestDto);
  }

  @Post('service-information')
  async serviceInformation(@Body() requestDto: ServiceInformationDto) {
    return this.biletAllService.serviceInformation(requestDto);
  }

  @Post('get-route')
  async getRoute(@Body() requestDto: BusRouteDto) {
    return this.biletAllService.getRoute(requestDto);
  }

  @Post('sale-request')
  async saleRequest(@Body() requestDto: BusPurchaseDto) {
    return this.biletAllService.saleRequest(requestDto);
  }
}
