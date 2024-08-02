// src/biletall/biletall.controller.ts

import { Controller, Post, Body, Get, Query } from '@nestjs/common';

// services
import { BiletAllService } from './services/biletall/biletall.service';
import { BusService } from './services/bus.service';

// dto
import { BusCompanyDto, BusCompanyResponseDto } from './dto/bus-company.dto';
import {
  BusScheduleResponseDto,
  ScheduleListDto,
} from './dto/bus-schedule-list.dto';
import { BusSearchDto, BusSearchResponseDto } from './dto/bus-search.dto';
import { BusSeatControlDto } from './dto/bus-seat-control.dto';
import {
  BoardingPointDto,
  BoardingPointResponseDto,
} from './dto/bus-boarding-point.dto';
import {
  ServiceInformationDto,
  ServiceInformationResponseDto,
} from './dto/bus-service-information.dto';
import { BusPurchaseDto } from './dto/bus-purchase.dto';
import { BusRouteDto, RouteDetailResponseDto } from './dto/bus-route.dto';
import { StopPointSearchQueryDto } from './dto/stop-point-search-query.dto';

@Controller('bus')
export class BusController {
  constructor(
    private readonly biletAllService: BiletAllService,
    private readonly busService: BusService,
  ) {}

  @Get('company')
  async company(
    @Body() requestDto: BusCompanyDto,
  ): Promise<BusCompanyResponseDto[]> {
    return this.biletAllService.company(requestDto);
  }

  @Get('stop-point-search')
  async stopPointsByName(@Query() { name }: StopPointSearchQueryDto) {
    return this.busService.getStopPointsByName(name);
  }

  @Post('schedule-list')
  async scheduleList(@Body() requestDto: ScheduleListDto): Promise<{
    schedules: BusScheduleResponseDto[];
    features: BusScheduleResponseDto[];
  }> {
    return this.biletAllService.scheduleList(requestDto);
  }

  @Post('bus-search')
  async busSearch(@Body() requestDto: BusSearchDto): Promise<{
    trips: BusSearchResponseDto[];
    seats: BusSearchResponseDto[];
    travelTypes: BusSearchResponseDto[];
    features: BusSearchResponseDto[];
    paymentRules: BusSearchResponseDto[];
  }> {
    return this.biletAllService.busSearch(requestDto);
  }

  @Post('bus-seat-control')
  async busSeatControl(@Body() requestDto: BusSeatControlDto) {
    const result = await this.biletAllService.busSeatControl(requestDto);
    return { isAvailable: result };
  }

  @Post('boarding-point')
  async boardingPoint(
    @Body() requestDto: BoardingPointDto,
  ): Promise<BoardingPointResponseDto[]> {
    return this.biletAllService.boardingPoint(requestDto);
  }

  @Post('service-information')
  async serviceInformation(
    @Body() requestDto: ServiceInformationDto,
  ): Promise<ServiceInformationResponseDto[]> {
    return this.biletAllService.serviceInformation(requestDto);
  }

  @Post('sale-request')
  async saleRequest(@Body() requestDto: BusPurchaseDto) {
    return this.biletAllService.saleRequest(requestDto);
  }

  @Post('get-route')
  async getRoute(
    @Body() requestDto: BusRouteDto,
  ): Promise<RouteDetailResponseDto[]> {
    return this.biletAllService.getRoute(requestDto);
  }
}
