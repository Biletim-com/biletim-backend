import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// services
import { BiletAllBusService } from './services/biletall/biletall-bus.service';
import { BusService } from './services/bus.service';

// entities
import { BusTerminal } from './entities/bus-terminal.entity';

// dto
import { BusCompanyDto, BusCompanyRequestDto } from './dto/bus-company.dto';
import {
  BusScheduleListResponseDto,
  BusScheduleRequestDto,
} from './dto/bus-schedule-list.dto';
import {
  BusTicketDetailDto,
  BusTicketDetailRequestDto,
} from './dto/bus-ticket-detail.dto';
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
import { BusTicketPurchaseDto } from '@app/common/dtos/bus-ticket-purchase.dto';
import { BusTerminalSearchQueryDto } from './dto/bus-terminal-search-query.dto';

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
  @ApiOperation({ summary: 'Search Bus Situation Of Seats And Route Plan' })
  @Post('bus-ticket-detail')
  async busTicketDetail(
    @Body() requestDto: BusTicketDetailRequestDto,
  ): Promise<BusTicketDetailDto> {
    const response = await this.biletAllBusService.busTicketDetail(requestDto);
    return new BusTicketDetailDto(response.busDetail, response.routeDetail);
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

  // @ApiOperation({ summary: 'Handle Bus Ticket Sale Request' })
  // @Post('sale-request')
  // async saleRequest(@Body() requestDto: BusTicketPurchaseDto) {
  //   return this.biletAllBusService.saleRequest(requestDto);
  // }
}
