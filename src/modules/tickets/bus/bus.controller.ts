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
import { BusTerminalSearchQueryDto } from './dto/bus-terminal-search-query.dto';

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
    const companies = await this.biletAllService.company(requestDto);
    return BusCompanyResponseDto.finalVersionBusCompanyResponse(companies);
  }

  @Get('bus-terminal-search')
  async busTerminalsByName(@Query() { name }: BusTerminalSearchQueryDto) {
    return this.busService.getBusTerminalsByName(name);
  }

  @Post('schedule-list')
  async scheduleList(@Body() requestDto: ScheduleListDto): Promise<{
    schedules: BusScheduleResponseDto[];
    features: BusScheduleResponseDto[];
  }> {
    const { schedules, features } = await this.biletAllService.scheduleList(
      requestDto,
    );
    return BusScheduleResponseDto.finalVersionBusScheduleResponse({
      schedules,
      features,
    });
  }

  @Post('bus-search')
  async busSearch(@Body() requestDto: BusSearchDto): Promise<{
    trips: BusSearchResponseDto[];
    seats: BusSearchResponseDto[];
    travelTypes: BusSearchResponseDto[];
    features: BusSearchResponseDto[];
    paymentRules: BusSearchResponseDto[];
  }> {
    const { trips, seats, travelTypes, features, paymentRules } =
      await this.biletAllService.busSearch(requestDto);
    return BusSearchResponseDto.finalVersionBusSearchResponse(
      trips,
      seats,
      travelTypes,
      features,
      paymentRules,
    );
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
    const boardingPoints = await this.biletAllService.boardingPoint(requestDto);
    return BoardingPointResponseDto.finalVersionBoardingPointResponse(
      boardingPoints,
    );
  }

  @Post('service-information')
  async serviceInformation(
    @Body() requestDto: ServiceInformationDto,
  ): Promise<ServiceInformationResponseDto[]> {
    const serviceInformations = await this.biletAllService.serviceInformation(
      requestDto,
    );
    return ServiceInformationResponseDto.finalVersionServiceInformationResponse(
      serviceInformations,
    );
  }

  @Post('get-route')
  async getRoute(
    @Body() requestDto: BusRouteDto,
  ): Promise<RouteDetailResponseDto[]> {
    const routeDetails = await this.biletAllService.getRoute(requestDto);
    return RouteDetailResponseDto.finalVersionRouteDetailResponse(routeDetails);
  }

  @Post('sale-request')
  async saleRequest(@Body() requestDto: BusPurchaseDto) {
    return this.biletAllService.saleRequest(requestDto);
  }
}
