import { Controller, Post, Body, Get, Query } from '@nestjs/common';

// services
import { BiletAllBusService } from './services/biletall/biletall-bus.service';
import { BusService } from './services/bus.service';

// dto
import { BusCompanyDto, BusCompanyRequestDto } from './dto/bus-company.dto';
import {
  BusScheduleListResponseDto,
  BusScheduleRequestDto,
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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Bus')
@Controller('bus')
export class BusController {
  constructor(
    private readonly biletAllBusService: BiletAllBusService,
    private readonly busService: BusService,
  ) {}

  @ApiOperation({ summary: 'Get Bus Companies' })
  @Get('company')
  async company(
    @Query() requestDto: BusCompanyRequestDto,
  ): Promise<BusCompanyDto[]> {
    return this.biletAllBusService.company(requestDto);
  }

  @ApiOperation({ summary: 'Search Bus Terminals By Terminal name and Region' })
  @Get('bus-terminal-search')
  async searchBusTerminals(
    @Query() { searchTerm }: BusTerminalSearchQueryDto,
  ): Promise<BusTerminal[]> {
    return this.busService.searchBusTerminals(searchTerm);
  }

  @ApiOperation({ summary: 'Get Schedule List and Features' })
  @Get('schedule-list')
  async scheduleList(
    @Query() requestDto: BusScheduleRequestDto,
  ): Promise<BusScheduleListResponseDto> {
    const response = await this.biletAllBusService.scheduleList(requestDto);
    return new BusScheduleListResponseDto(
      response.departureSchedulesAndFeatures,
      response?.returnSchedulesAndFeatures,
    );
  }
  @ApiOperation({ summary: 'Search Bus For One Company' })
  @Post('bus-search')
  async busSearch(
    @Body() requestDto: BusSearchRequestDto,
  ): Promise<BusSearchDto> {
    return await this.biletAllBusService.busSearch(requestDto);
  }

  @ApiOperation({ summary: 'Check Bus Seat Availability' })
  @Post('bus-seat-availability')
  async busSeatAvailability(
    @Body() requestDto: BusSeatAvailabilityRequestDto,
  ): Promise<BusSeatAvailabilityDto> {
    return this.biletAllBusService.busSeatAvailability(requestDto);
  }

  @ApiOperation({ summary: 'Search Boarding Points Information' })
  @Post('boarding-point')
  async boardingPoint(
    @Body() requestDto: BoardingPointRequestDto,
  ): Promise<BoardingPointDto[]> {
    return this.biletAllBusService.boardingPoint(requestDto);
  }

  @ApiOperation({ summary: 'Search Bus Service Information' })
  @Post('service-information')
  async serviceInformation(
    @Body() requestDto: ServiceInformationRequestDto,
  ): Promise<ServiceInformationDto[]> {
    return this.biletAllBusService.serviceInformation(requestDto);
  }

  @ApiOperation({ summary: 'Search Route' })
  @Post('get-route')
  async getRoute(
    @Body() requestDto: BusRouteRequestDto,
  ): Promise<BusRouteDetailDto[]> {
    return this.biletAllBusService.getRoute(requestDto);
  }

  @ApiOperation({ summary: 'Handle Bus Ticket Sale Request' })
  @Post('sale-request')
  async saleRequest(@Body() requestDto: BusPurchaseDto) {
    return this.biletAllBusService.saleRequest(requestDto);
  }
}
