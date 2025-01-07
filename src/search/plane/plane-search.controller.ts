import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// services
import { AirportsService } from '../../providers/ticket/biletall/plane/services/airports.service';
import { BiletAllPlaneSearchService } from '@app/providers/ticket/biletall/plane/services/biletall-plane-search.service';

// entites
import { Airport } from '../../providers/ticket/biletall/plane/entities/airport.entity';

// decorators
import { ClientIp } from '@app/common/decorators';

// dto
import { AirportSearchQueryDto } from './dto/airport-search-query.dto';
import { PlaneFlightScheduleRequestDto } from './dto/plane-flight-schedule.dto';
import {
  PullAbroadFlightPackagesRequestDto,
  PullAbroadFlightPackagesResponseDto,
} from './dto/plane-pull-abroad-flight-packages.dto';
import {
  PullPriceFlightRequestDto,
  PullPriceFlightResponseDto,
} from './dto/plane-pull-price-flight.dto';
import { PlanePassengerAgeRuleDto } from '@app/providers/ticket/biletall/plane/dto/plane-company-passenger-age-rule.dto';
import { PlaneDomesticFlightScheduleResponseDto } from './dto/plane-domestic-flight-schedule.dto';
import { PlaneAbroadFlightScheduleResponseDto } from './dto/plane-abroad-flight-schedule.dto';

@ApiTags('Plane Search')
@Controller('search/plane')
export class PlaneSearchController {
  constructor(
    private readonly airportsService: AirportsService,
    private readonly biletAllPlaneSearchService: BiletAllPlaneSearchService,
  ) {}

  @ApiOperation({
    summary:
      'Airport search by CountryName, CityName, AirportCode and AirportName',
  })
  @Get('airports')
  async busTerminalsByName(
    @Query() { searchText }: AirportSearchQueryDto,
  ): Promise<Airport[]> {
    return this.airportsService.searchAirports(searchText);
  }

  @ApiOperation({ summary: 'Search Flight Schedule (Domestic/Abroad)' })
  @Get('flight-schedule')
  async flightScheduleSearch(
    @ClientIp() clientIp: string,
    @Query() requestDto: PlaneFlightScheduleRequestDto,
  ): Promise<
    | PlaneDomesticFlightScheduleResponseDto
    | PlaneAbroadFlightScheduleResponseDto
  > {
    if (requestDto.isAbroad === 'true') {
      const responseAbroadService =
        await this.biletAllPlaneSearchService.searchAbroadFlights(
          clientIp,
          requestDto,
        );
      return new PlaneAbroadFlightScheduleResponseDto(
        responseAbroadService.departureFlights,
        responseAbroadService?.returnFlights,
        responseAbroadService?.operationId,
      );
    } else {
      const responseDomesticService =
        await this.biletAllPlaneSearchService.searchDomesticFlights(
          clientIp,
          requestDto,
        );
      return new PlaneDomesticFlightScheduleResponseDto(
        responseDomesticService.departureFlightsWithFares,
        responseDomesticService?.returnFlightsWithFares,
      );
    }
  }

  @ApiOperation({ summary: 'Get Plane Passenger Age Rules' })
  @Get('passenger-age-rules')
  async planePassengerAgeRules(): Promise<PlanePassengerAgeRuleDto[]> {
    return this.biletAllPlaneSearchService.getPassengerAgeRulesPerCompany();
  }

  @ApiOperation({ summary: 'Pull Price Of Flight' })
  @Post('pull-price')
  async pullPriceOfFlight(
    @Body() requestDto: PullPriceFlightRequestDto,
  ): Promise<PullPriceFlightResponseDto> {
    const { priceList, paymentRules, baggageInfo, additionalServiceRules } =
      await this.biletAllPlaneSearchService.getPriceOfFlight(requestDto);
    return new PullPriceFlightResponseDto(
      priceList,
      paymentRules,
      baggageInfo,
      additionalServiceRules,
    );
  }

  @ApiOperation({ summary: 'Pull Abroad Flight Price Packages' })
  @Post('pull-abroad-flight-packages')
  async pullAbroadFlightPricePackages(
    @Body() requestDto: PullAbroadFlightPackagesRequestDto,
  ): Promise<PullAbroadFlightPackagesResponseDto> {
    const response =
      await this.biletAllPlaneSearchService.getAbroadFlightPackages(requestDto);
    return new PullAbroadFlightPackagesResponseDto(
      response.transactionId,
      response.currencyTypeCode,
      response.isSuccess,
      response.message,
      response.brandFareInfos,
    );
  }
}
