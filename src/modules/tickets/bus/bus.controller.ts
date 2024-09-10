// src/biletall/biletall.controller.ts

import { Controller, Post, Body, Get, Query } from '@nestjs/common';

// services
import { BiletAllService } from './services/biletall/biletall.service';
import { BusService } from './services/bus.service';

// dto
import { BusCompanyDto, BusCompanyRequestDto } from './dto/bus-company.dto';
import {
  BusScheduleRequestDto,
  BusScheduleAndBusFeaturesDto,
} from './dto/bus-schedule-list.dto';
import { BusSearchRequestDto, BusSearchDto } from './dto/bus-search.dto';
import {
  BusSeatAvailabilityDto,
  BusSeatAvailabilityRequestDto,
} from './dto/bus-seat-availability.dto';
import {
  BoardingPointDto,
  BoardingPointRequestDto,
} from './dto/bus-boarding-point.dto';
import {
  ServiceInformationRequestDto,
  ServiceInformationDto,
} from './dto/bus-service-information.dto';
import { BusPurchaseDto } from './dto/bus-purchase.dto';
import { BusRouteRequestDto, BusRouteDetailDto } from './dto/bus-route.dto';
import { BusTerminalSearchQueryDto } from './dto/bus-terminal-search-query.dto';
import { BusTerminal } from './entities/bus-terminal.entity';

@Controller('bus')
export class BusController {
  constructor(
    private readonly biletAllService: BiletAllService,
    private readonly busService: BusService,
  ) {}

  @Get('company')
  async company(
    @Body() requestDto: BusCompanyRequestDto,
  ): Promise<BusCompanyDto[]> {
    return this.biletAllService.company(requestDto);
  }

  @Get('bus-terminal-search')
  async busTerminalsByName(
    @Query() { name }: BusTerminalSearchQueryDto,
  ): Promise<BusTerminal[]> {
    return this.busService.getBusTerminalsByName(name);
  }

  @Post('schedule-list')
  async scheduleList(
    @Body() requestDto: BusScheduleRequestDto,
  ): Promise<BusScheduleAndBusFeaturesDto> {
    return this.biletAllService.scheduleList(requestDto);
  }

  @Post('bus-search')
  async busSearch(
    @Body() requestDto: BusSearchRequestDto,
  ): Promise<BusSearchDto> {
    return await this.biletAllService.busSearch(requestDto);
  }

  @Post('bus-seat-availability')
  async busSeatAvailability(
    @Body() requestDto: BusSeatAvailabilityRequestDto,
  ): Promise<BusSeatAvailabilityDto> {
    return this.biletAllService.busSeatAvailability(requestDto);
  }

  @Post('boarding-point')
  async boardingPoint(
    @Body() requestDto: BoardingPointRequestDto,
  ): Promise<BoardingPointDto[]> {
    return this.biletAllService.boardingPoint(requestDto);
  }

  @Post('service-information')
  async serviceInformation(
    @Body() requestDto: ServiceInformationRequestDto,
  ): Promise<ServiceInformationDto[]> {
    return this.biletAllService.serviceInformation(requestDto);
  }

  @Post('get-route')
  async getRoute(
    @Body() requestDto: BusRouteRequestDto,
  ): Promise<BusRouteDetailDto[]> {
    return this.biletAllService.getRoute(requestDto);
  }

  @Post('sale-request')
  async saleRequest(@Body() requestDto: BusPurchaseDto) {
    return this.biletAllService.saleRequest(requestDto);
  }
}
