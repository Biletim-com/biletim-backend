import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  IsArray,
  ValidateNested,
  IsOptional,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InsuranceProductType, InsuranceTicketType } from '@app/common/enums';
import {
  en,
  GetPriceTravelHealthInsuranceResponse,
  Guarantees,
  InsuranceCompanyInfos,
  ProductInfos,
  tr,
} from '../types/get-price-travel-health-insurance-response.type';

export class InsuranceCustomerInfoDto {
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
    description: 'TC identification number of the insured person.',
    example: 'XXXXXXXXX',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tcNumber: string;

  @ApiProperty({
    description: 'Birthdate of the insured person in YYYY-MM-DD format.',
    example: '1990-01-01',
    required: true,
  })
  @IsDateString({}, { message: 'Birthdate must be in the format yyyy-MM-dd' })
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty({
    description: 'Mobile phone number of the insured person.',
    example: '537XXXXX',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  gsmNumber: string;

  @ApiProperty({
    description: 'Email address of the insured person.',
    example: 'XXXX@tamamliyo.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'First name of the insured person.',
    example: 'XXXX',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the insured person.',
    example: 'XXXXX',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}

export class GetPriceTravelHealthInsuranceRequestDto {
  @ApiProperty({
    description: 'Number of insured persons.',
    example: 1,
    required: true,
  })
  @IsInt()
  @IsNotEmpty()
  insuredPersonCount: number;

  @ApiProperty({
    description: 'Start date of the insurance policy.',
    example: '2023-11-28',
    required: true,
  })
  @IsDateString({}, { message: 'Start date must be in the format yyyy-MM-dd' })
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'End date of the insurance policy.',
    example: '2023-11-30',
    required: true,
  })
  @IsDateString({}, { message: 'End date must be in the format yyyy-MM-dd' })
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    description: 'Type of product (e.g., international travel insurance).',
    example: 'domestic-travel',
    required: true,
  })
  @IsEnum(InsuranceProductType, {
    message: 'Product type must be either domestic-travel or abroad-travel',
  })
  @IsNotEmpty()
  productType: InsuranceProductType;

  @ApiProperty({
    description: 'Country code of the insured country.',
    example: 56,
    required: false,
  })
  @IsInt()
  @IsOptional()
  @ValidateIf((o) => o.productType === InsuranceProductType.ABROAD_TRAVEL)
  @IsNotEmpty({
    message: 'Country code is required for Abroad travel insurance',
  })
  countryCode?: number;

  @ApiProperty({
    description: 'List of insured persons (policy holders).',
    type: [InsuranceCustomerInfoDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InsuranceCustomerInfoDto)
  @IsNotEmpty()
  customerInfo: InsuranceCustomerInfoDto[];
}

export class GetPriceTravelHealthInsuranceRequestDtoInTurkish {
  sigortaliSayisi: number;
  baslangicTarihi: string;
  bitisTarihi: string;
  urun: string;
  ulkeKodu?: number;
  customerInfo: Array<{
    ticketType: string;
    tcKimlikNo: string;
    dogumTarihi: string;
    gsm_no: string;
    email: string;
    ad: string;
    soyad: string;
  }>;
}

export class GuaranteesDto {
  tr: tr;
  en: en;

  constructor(data: Guarantees) {
    this.tr = data.tr;
    this.en = data.en;
  }
}

export class ProductInfosDto {
  productId: number;
  price: string;
  priceEuro: string;
  priceUsd: string;
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

  constructor(data: ProductInfos) {
    this.productId = data.urunId;
    this.price = data.fiyat;
    this.priceEuro = data.fiyatEuro;
    this.priceUsd = data.fiyatUsd;
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
      en: data.urunAdiMultiple.en,
    };
    this.guarantees = new GuaranteesDto(data.teminatlar);
  }
}

export class InsuranceCompanyInfosDto {
  insuranceCompanyId: number;
  shortName: string;
  fullName: string;
  publisher: string;
  publisherMultiple: {
    tr: string;
    en: string;
  };

  constructor(data: InsuranceCompanyInfos) {
    this.insuranceCompanyId = data.sigortaSirketiId;
    this.shortName = data.kisaAdi;
    this.fullName = data.tamAdi;
    this.publisher = data.yayinci;
    this.publisherMultiple = {
      tr: data.yayinciMultiple.tr,
      en: data.yayinciMultiple.en,
    };
  }
}

export class GetPriceTravelHealthInsuranceResponseDto {
  success: boolean;
  data: {
    productInfos: ProductInfosDto;
    insuranceCompanyInfos: InsuranceCompanyInfosDto;
  };

  constructor(response: GetPriceTravelHealthInsuranceResponse) {
    this.success = response.success;
    this.data = {
      productInfos: new ProductInfosDto(response?.data?.urunBilgileri),
      insuranceCompanyInfos: new InsuranceCompanyInfosDto(
        response.data.sigortaSirketiBilgileri,
      ),
    };
  }
}
