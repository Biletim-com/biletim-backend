import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { BiletAllService } from './services/biletall/biletall.service';
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
import { StopPointSearchQueryDto } from './dto/stop-point-search-query.dto';

import { BusService } from './services/bus.service';

@Controller('bus')
export class BusController {
  constructor(
    private readonly biletAllService: BiletAllService,
    private readonly busService: BusService,
  ) {}

  @Get('company')
  async company(@Body() requestDto: CompanyRequestDto): Promise<any> {
    return this.biletAllService.company(requestDto);
  }

  @Get('stop-point-search')
  async stopPointsByName(@Query() { name }: StopPointSearchQueryDto) {
    return this.busService.getStopPointsByName(name);
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
    const result = await this.biletAllService.busSeatControl(requestDto);
    return { isAvailable: result };
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
