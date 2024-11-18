import { InsuranceTicketType } from '@app/common/enums';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InsuranceCompanyInfosDto } from './get-price-travel-health-insurance.dto';
import {
  GetPriceProductInfosTicketCancellationProtectionInsurance,
  GetPriceTicketCancellationProtectionInsuranceEn,
  GetPriceTicketCancellationProtectionInsuranceResponse,
  GetPriceTicketCancellationProtectionInsuranceTr,
  Guarantees,
} from '../types/get-price-ticket-cancellation-protection-insurance.type';

export class TicketCancellationProtectionParameters {
  @ApiProperty({
    description: 'Ticket type (bus or plane).',
    example: 'bus',
    required: true,
  })
  @IsEnum(InsuranceTicketType, {
    message: 'Ticket type must be either bus or plane.',
  })
  @IsNotEmpty()
  ticketType: InsuranceTicketType;

  @ApiProperty({
    description: 'Ticket price (e.g., "1050.90")',
    example: '1050.90',
  })
  @IsString()
  @IsNotEmpty()
  ticketPrice: string;

  @ApiProperty({
    description: 'Travel company name',
    example: 'Pegasus',
  })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({
    description: 'Departure city',
    example: 'Antalya',
  })
  @IsString()
  @IsNotEmpty()
  departureLocation: string;

  @ApiProperty({
    description: 'Departure airport code',
    example: 'AYT',
  })
  @IsString()
  @IsOptional()
  departureAirport?: string;

  @ApiProperty({
    description: 'Arrival city',
    example: 'Dublin',
  })
  @IsString()
  @IsNotEmpty()
  arrivalLocation: string;

  @ApiProperty({
    description: 'Arrival airport code',
    example: 'DUB',
  })
  @IsString()
  @IsOptional()
  arrivalAirport: string;

  @ApiProperty({
    description: 'Departure date and time (e.g., "2024-12-01 23:00")',
    example: '2024-12-01 23:00',
  })
  @IsString()
  departureDate: string;
}

export class GetPriceTicketCancellationProtectionInsuranceRequestDto {
  @ApiProperty({
    description: 'Number of insured people',
    example: 2,
  })
  @IsInt()
  @Min(1)
  insuredPersonCount: number;

  @ApiProperty({
    description: 'Ticket cancellation parameters',
    type: TicketCancellationProtectionParameters,
  })
  @ValidateNested()
  @Type(() => TicketCancellationProtectionParameters)
  parameters: TicketCancellationProtectionParameters;
}

export class GetPriceTicketCancellationProtectionInsuranceDtoInTurkish {
  sigortaliSayisi: number;
  parameters: {
    ticketType: number;
    ticketPrice: string;
    company: string;
    departureLocation: string;
    departureAirport?: string;
    arrivalLocation: string;
    arrivalAirport?: string;
    departureDate: string;
  };
}

export class GuaranteesDto {
  tr: GetPriceTicketCancellationProtectionInsuranceTr;
  en: GetPriceTicketCancellationProtectionInsuranceEn;

  constructor(data: Guarantees) {
    this.tr = data.tr;
    this.en = data.en;
  }
}

export class GetPriceProductInfosTicketCancellationProtectionInsuranceDTO {
  productId: number;
  productName: string;
  productNameMultiple: {
    tr: string;
    en: string;
  };
  productDescription: string;
  productCategoryTitle: string;
  productCategoryDescription: string;
  productCategoryMultiple: {
    tr: string;
    en: string;
  };
  guarantees: GuaranteesDto;

  constructor(data: GetPriceProductInfosTicketCancellationProtectionInsurance) {
    this.productId = data.urunId;
    this.productName = data.urunAdi;
    this.productNameMultiple = {
      tr: data.urunAdiMultiple.tr,
      en: data.urunAdiMultiple.en,
    };
    this.productDescription = data.urunTanimi;
    this.productCategoryTitle = data.urunKategoriBaslik;
    this.productCategoryDescription = data.urunKategoriAciklama;
    this.productCategoryMultiple = {
      tr: data.urunKategoriMultiple.tr,
      en: data.urunKategoriMultiple.en,
    };
    this.guarantees = new GuaranteesDto(data.teminatlar);
  }
}

export class GetPriceTicketCancellationProtectionInsuranceResponseDto {
  success: boolean;
  data: {
    offerInfo: {
      offerId: number;
      price: string;
      departureDate: string;
      startDate: string;
      endDate: string;
    };
    productInfos: GetPriceProductInfosTicketCancellationProtectionInsuranceDTO;
    insuranceCompanyInfos: InsuranceCompanyInfosDto;
  };

  constructor(data: GetPriceTicketCancellationProtectionInsuranceResponse) {
    this.success = data.success;
    this.data = {
      offerInfo: {
        offerId: data.data.teklifBilgileri.teklifId,
        price: data.data.teklifBilgileri.fiyat,
        departureDate: data.data.teklifBilgileri.kalkisTarihi,
        startDate: data.data.teklifBilgileri.baslangicTarihi,
        endDate: data.data.teklifBilgileri.bitisTarihi,
      },
      productInfos:
        new GetPriceProductInfosTicketCancellationProtectionInsuranceDTO(
          data.data.urunBilgileri,
        ),
      insuranceCompanyInfos: new InsuranceCompanyInfosDto(
        data.data.sigortaSirketiBilgileri,
      ),
    };
  }
}
