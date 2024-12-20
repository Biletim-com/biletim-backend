import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// services
import { BiletAllBusSearchService } from '@app/providers/ticket/biletall/bus/services/biletall-bus-search.service';
import { BusTerminalsService } from '@app/providers/ticket/biletall/bus/services/bus-terminals.service';

// entities
import { BusTerminal } from '@app/providers/ticket/biletall/bus/entities/bus-terminal.entity';

// decorators
import { ClientIp } from '@app/common/decorators';

// request dto
import { BusCompanyRequestDto } from './dto/bus-company.dto';
import { BusScheduleRequestDto } from './dto/bus-schedule-list.dto';
import { BusTicketDetailRequestDto } from './dto/bus-ticket-detail.dto';
import { BusSeatAvailabilityRequestDto } from './dto/bus-seat-availability.dto';
import { BusTerminalSearchQueryDto } from './dto/bus-terminal-search-query.dto';

// response dto
import { BusCompanyDto } from '@app/providers/ticket/biletall/bus/dto/bus-company.dto';
import { BusScheduleListResponseDto } from '@app/providers/ticket/biletall/bus/dto/bus-schedule-list.dto';
import { BusSeatAvailabilityDto } from '@app/providers/ticket/biletall/bus/dto/bus-seat-availability.dto';
import { BusTicketDetailDto } from '@app/providers/ticket/biletall/bus/dto/bus-ticket-detail.dto';

@ApiTags('Bus Search')
@Controller('search/bus')
export class BusSearchController {
  constructor(
    private readonly BiletAllBusSearchService: BiletAllBusSearchService,
    private readonly busTerminalsService: BusTerminalsService,
  ) {}

  @ApiOperation({ summary: 'Get Bus Companies' })
  @Get('company')
  async company(
    @Query() requestDto: BusCompanyRequestDto,
  ): Promise<BusCompanyDto[]> {
    return this.BiletAllBusSearchService.companies(requestDto);
  }

  @ApiOperation({ summary: 'Search Bus Terminals By Terminal name and Region' })
  @Get('bus-terminals')
  async searchBusTerminals(
    @Query() { searchTerm }: BusTerminalSearchQueryDto,
  ): Promise<BusTerminal[]> {
    return this.busTerminalsService.searchBusTerminals(searchTerm);
  }

  @ApiOperation({ summary: 'Get Schedule List and Features' })
  @Get('schedule-list')
  async scheduleList(
    @ClientIp() clientIp: string,
    @Query() requestDto: BusScheduleRequestDto,
  ): Promise<BusScheduleListResponseDto> {
    const response = await this.BiletAllBusSearchService.searchTripSchedules(
      clientIp,
      requestDto,
    );
    return new BusScheduleListResponseDto(
      response.departureSchedulesAndFeatures,
      response?.returnSchedulesAndFeatures,
    );
  }
  @ApiOperation({ summary: 'Search Bus Situation Of Seats And Route Plan' })
  @Post('bus-ticket-detail')
  async busTicketDetail(
    @ClientIp() clientIp: string,
    @Body() requestDto: BusTicketDetailRequestDto,
  ): Promise<BusTicketDetailDto> {
    const response = await this.BiletAllBusSearchService.busTicketDetail(
      clientIp,
      requestDto,
    );
    return new BusTicketDetailDto(response.busDetail, response.routeDetail);
  }

  @ApiOperation({ summary: 'Check Bus Seat Availability' })
  @Post('bus-seat-availability')
  async busSeatAvailability(
    @ClientIp() clientIp: string,
    @Body() requestDto: BusSeatAvailabilityRequestDto,
  ): Promise<BusSeatAvailabilityDto> {
    return this.BiletAllBusSearchService.busSeatAvailability(
      clientIp,
      requestDto,
    );
  }
}
