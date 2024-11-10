import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TravelHealthInsuranceService } from './travel-health-insurance.service';
import { TravelHealthInsuranceRequestDto } from './dto/travel-health-insurance.dto';

@ApiTags('Travel-Health-Insurance')
@Controller('travel-health-insurance')
export class TravelHealthInsuranceController {
  constructor(
    private readonly travelHealthInsuranceService: TravelHealthInsuranceService,
  ) {}

  @ApiOperation({ summary: 'Create Offer For Travel Health Insurance' })
  @Post('/create-offer')
  async createOffer(
    @Body() requestDto: TravelHealthInsuranceRequestDto,
  ): Promise<any> {
    return await this.travelHealthInsuranceService.createOffer(requestDto);
  }
}
