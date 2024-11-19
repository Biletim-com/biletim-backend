import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TravelHealthInsuranceService } from './providers/tamamliyo/services/travel-health-insurance.service';
import { TamamliyoService } from './providers/tamamliyo/services/tamamliyo.service';
import { GetCountriesResponseDto } from './providers/tamamliyo/dto/get-countries.dto';
import {
  GetPriceTravelHealthInsuranceRequestDto,
  GetPriceTravelHealthInsuranceResponseDto,
} from './providers/tamamliyo/dto/get-price-travel-health-insurance.dto';
import {
  CreateOfferTravelHealthInsuranceRequestDto,
  CreateOfferTravelHealthInsuranceResponseDTO,
} from './providers/tamamliyo/dto/create-offer-travel-health-insurance.dto';
import {
  GetPriceTicketCancellationProtectionInsuranceRequestDto,
  GetPriceTicketCancellationProtectionInsuranceResponseDto,
} from './providers/tamamliyo/dto/get-price-ticket-cancellation-protection-insurance.dto';
import { TicketCancellationProtectionInsuranceService } from './providers/tamamliyo/services/ticket-cancellation-protection.service';
import {
  CreateOfferTicketCancellationProtectionInsuranceRequestDto,
  CreateOfferTicketCancellationProtectionInsuranceResponseDto,
} from './providers/tamamliyo/dto/create-offer-ticket-cancellation-protection-insurance.dto';

@ApiTags('Insurance')
@Controller('insurance')
export class InsuranceController {
  private readonly logger = new Logger(InsuranceController.name);
  constructor(
    private readonly travelHealthInsuranceService: TravelHealthInsuranceService,
    private readonly tamamliyoService: TamamliyoService,
    private readonly ticketCancellationProtectionInsuranceService: TicketCancellationProtectionInsuranceService,
  ) {}

  @ApiOperation({ summary: 'Get Countries' })
  @Get('/get-countries')
  async getCountries(): Promise<GetCountriesResponseDto> {
    const response = await this.tamamliyoService.getCountries();
    return new GetCountriesResponseDto(response);
  }

  @ApiOperation({ summary: 'Get Price For Travel Health Insurance' })
  @Post('/travel-health-insurance/get-price')
  async getPriceTravelHealthInsurance(
    @Body() requestDto: GetPriceTravelHealthInsuranceRequestDto,
  ): Promise<GetPriceTravelHealthInsuranceResponseDto> {
    const response =
      await this.travelHealthInsuranceService.getPriceTravelHealthInsurance(
        requestDto,
      );
    return new GetPriceTravelHealthInsuranceResponseDto(response);
  }

  @ApiOperation({ summary: 'Create Offer For Travel Health Insurance' })
  @Post('/travel-health-insurance/create-offer')
  async createOfferTravelHealthInsurance(
    @Body() requestDto: CreateOfferTravelHealthInsuranceRequestDto,
  ): Promise<CreateOfferTravelHealthInsuranceResponseDTO> {
    const response =
      await this.travelHealthInsuranceService.createOfferTravelHealthInsurance(
        requestDto,
      );
    return new CreateOfferTravelHealthInsuranceResponseDTO(response);
  }

  @ApiOperation({
    summary: 'Get Price For Ticket Cancellation Protection Insurance',
  })
  @Post('/ticket-cancellation-protection-insurance/get-price')
  async getPriceTicketCancellationProtectionInsurance(
    @Body() requestDto: GetPriceTicketCancellationProtectionInsuranceRequestDto,
  ): Promise<GetPriceTicketCancellationProtectionInsuranceResponseDto> {
    const response =
      await this.ticketCancellationProtectionInsuranceService.getPriceTicketCancellationProtectionInsurance(
        requestDto,
      );

    return new GetPriceTicketCancellationProtectionInsuranceResponseDto(
      response,
    );
  }

  @ApiOperation({
    summary: 'Create Offer For Ticket Cancellation Protection Insurance',
  })
  @Post('/ticket-cancellation-protection-insurance/create-offer')
  async createOfferTicketCancellationProtectionInsurance(
    @Body()
    requestDto: CreateOfferTicketCancellationProtectionInsuranceRequestDto,
  ): Promise<CreateOfferTicketCancellationProtectionInsuranceResponseDto> {
    const response =
      await this.ticketCancellationProtectionInsuranceService.createOfferTicketCancellationProtectionInsurance(
        requestDto,
      );

    return new CreateOfferTicketCancellationProtectionInsuranceResponseDto(
      response,
    );
  }
}
