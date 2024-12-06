import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// services
import { PlaneService } from './services/plane.service';
import { BiletAllPlaneSearchService } from '@app/providers/ticket/biletall/plane/services/biletall-plane-search.service';

// entites
import { Airport } from './entities/airport.entity';

// decorators
import { ClientIp } from '@app/common/decorators';

// request dto
import { AirportSearchQueryDto } from './dto/airport-search-query.dto';
import { PlaneFlightScheduleRequestDto } from './dto/plane-flight-schedule.dto';
import { PullAbroadFlightPricePackagesRequestDto } from './dto/plane-pull-abroad-flight-price-packages.dto';
import { PullPriceFlightRequestDto } from './dto/plane-pull-price-flight.dto';

// response dto
import { AbroadFlightScheduleDto } from '@app/providers/ticket/biletall/plane/dto/plane-abroad-flight-schedule.dto';
import { PlanePassengerAgeRuleDto } from '@app/providers/ticket/biletall/plane/dto/plane-company-passenger-age-rule.dto';
import { DomesticFlightScheduleDto } from '@app/providers/ticket/biletall/plane/dto/plane-domestic-flight-schedule.dto';
import { PullAbroadFlightPricePackagesResponseDto } from '@app/providers/ticket/biletall/plane/dto/plane-pull-abroad-flight-price-packages.dto';
import { PlanePullPriceFlightDto } from '@app/providers/ticket/biletall/plane/dto/plane-pull-price-flight.dto';

@ApiTags('Plane')
@Controller('plane')
export class PlaneController {
  constructor(
    private readonly planeService: PlaneService,
    private readonly biletAllPlaneSearchService: BiletAllPlaneSearchService,
  ) {}

  @ApiOperation({
    summary:
      'Airport search by CountryName, CityName, AirportCode and AirportName',
  })
  @Get('airport-search')
  async busTerminalsByName(
    @Query() { searchText }: AirportSearchQueryDto,
  ): Promise<Airport[]> {
    return this.planeService.searchAirports(searchText);
  }

  @ApiOperation({ summary: 'Search Flight Schedule (Domestic/Abroad)' })
  @Get('flight-schedule')
  async flightScheduleSearch(
    @ClientIp() clientIp: string,
    @Query() requestDto: PlaneFlightScheduleRequestDto,
  ): Promise<DomesticFlightScheduleDto | AbroadFlightScheduleDto> {
    if (requestDto.isAbroad === 'true') {
      const responseAbroadService =
        this.biletAllPlaneSearchService.searchAbroadFlights(
          clientIp,
          requestDto,
        );
      return new AbroadFlightScheduleDto(
        (await responseAbroadService).departureFlights,
        (await responseAbroadService)?.returnFlights,
        (await responseAbroadService)?.operationId,
      );
    } else {
      const responseDomesticService =
        this.biletAllPlaneSearchService.searchDomesticFlights(
          clientIp,
          requestDto,
        );
      return new DomesticFlightScheduleDto(
        (await responseDomesticService).departureFlightsWithFares,
        (await responseDomesticService)?.returnFlightsWithFares,
      );
    }
  }

  @ApiOperation({ summary: 'Pull Abroad Flight Price Packages' })
  @Post('pull-abroad-flight-price-packages')
  async pullAbroadFlightPricePackages(
    @Body() requestDto: PullAbroadFlightPricePackagesRequestDto,
  ): Promise<PullAbroadFlightPricePackagesResponseDto> {
    const response =
      await this.biletAllPlaneSearchService.getAbroadFlightPackages(requestDto);
    return new PullAbroadFlightPricePackagesResponseDto(
      response.transactionId,
      response.currencyTypeCode,
      response.isSuccess,
      response.message,
      response.brandFareInfos,
    );
  }

  @ApiOperation({ summary: 'Pull Price Of Flight' })
  @Post('pull-price')
  async pullPriceOfFlight(
    @Body() requestDto: PullPriceFlightRequestDto,
  ): Promise<PlanePullPriceFlightDto> {
    return this.biletAllPlaneSearchService.getPriceOfFlight(requestDto);
  }

  @ApiOperation({ summary: 'Get Plane Passenger Age Rules' })
  @Get('passenger-age-rules')
  async planePassengerAgeRules(): Promise<PlanePassengerAgeRuleDto[]> {
    return this.biletAllPlaneSearchService.getPassengerAgeRulesPerCompany();
  }
}
