import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TravelHealthInsuranceService } from './services/travel-health-insurance/travel-health-insurance.service';
import {
  GetPriceResponseDto,
  GetPriceTravelInsuranceRequestDto,
} from './services/travel-health-insurance/dto/get-price-travel-health-insurance.dto';
import { TamamliyoService } from './services/tamamliyo.service';
import { GetCountriesResponseDto } from './dto/get-countries.dto';
import { GetCitiesResponseDto } from './dto/get-cities.dto';
import {
  DistrictsRequestDto,
  GetDistrictsResponseDto,
} from './dto/get-districts.dto';

@ApiTags('Tamamliyo-Api')
@Controller('tamamliyo')
export class TamamliyoController {
  constructor(
    private readonly travelHealthInsuranceService: TravelHealthInsuranceService,
    private readonly tamamliyoService: TamamliyoService,
  ) {}

  @ApiOperation({ summary: 'Get Countries' })
  @Post('/get-countries')
  async getCountries(): Promise<GetCountriesResponseDto> {
    const response = await this.tamamliyoService.getCountries();
    return new GetCountriesResponseDto(response);
  }

  @ApiOperation({ summary: 'Get Cities' })
  @Post('/get-cities')
  async getCities(): Promise<GetCitiesResponseDto> {
    const response = await this.tamamliyoService.getCities();
    return new GetCitiesResponseDto(response);
  }
  @ApiOperation({ summary: 'Get Districts' })
  @Post('/get-districts')
  async getDistricts(
    @Body() requestDto: DistrictsRequestDto,
  ): Promise<GetDistrictsResponseDto> {
    const response = await this.tamamliyoService.getDistricts(requestDto);
    return new GetDistrictsResponseDto(response);
  }

  @ApiOperation({ summary: 'Get Price For Travel Health Insurance' })
  @Post('/travel-health-insurance/get-price')
  async getPrice(
    @Body() requestDto: GetPriceTravelInsuranceRequestDto,
  ): Promise<GetPriceResponseDto> {
    const response = await this.travelHealthInsuranceService.getPrice(
      requestDto,
    );
    return new GetPriceResponseDto(response);
  }
}
