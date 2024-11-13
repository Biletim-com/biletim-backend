import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TravelHealthInsuranceService } from './travel-health-insurance.service';
import {
  GetPriceResponseDto,
  GetPriceTravelInsuranceRequestDto,
} from './dto/get-price-travel-health-insurance.dto';

@ApiTags('Travel-Health-Insurance')
@Controller('travel-health-insurance')
export class TravelHealthInsuranceController {
  constructor(
    private readonly travelHealthInsuranceService: TravelHealthInsuranceService,
  ) {}

  @ApiOperation({ summary: 'Get Price For Travel Health Insurance' })
  @Post('/get-price')
  async getPrice(
    @Body() requestDto: GetPriceTravelInsuranceRequestDto,
  ): Promise<GetPriceResponseDto> {
    const response = await this.travelHealthInsuranceService.getPrice(
      requestDto,
    );
    return new GetPriceResponseDto(response);
  }
}
