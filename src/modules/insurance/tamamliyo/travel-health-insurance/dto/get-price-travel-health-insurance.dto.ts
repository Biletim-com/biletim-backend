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
import { InsuranceProductType } from '@app/common/enums/insurance-product-type.enum';
import { InsuranceTicketType } from '@app/common/enums/insurance-ticket-type.enum';
import {
  GetPriceResponse,
  Guarantees,
  InsuranceCompanyInfos,
  PersonalInfos,
  ProductInfos,
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
  tcKimlikNo: string;

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
  gsmNo: string;

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

export class GetPriceTravelInsuranceRequestDto {
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
    example: 'yurtdisi-seyahat',
    required: true,
  })
  @IsEnum(InsuranceProductType, {
    message: 'Product type must be either yurtici-seyahat or yurtdisi-seyahat',
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
  visa: string;
  medicalTreatmentCoverage: string;
  medicalTransferCoverage: string;
  returnToPermanentResidenceAfterTreatment: string;
  repatriationOfMortalRemains: string;
  medicalInformationAndConsultation: string;

  constructor(data: Guarantees['en']) {
    this.visa = data.Visa;
    this.medicalTreatmentCoverage = data['Medical Treatment Coverage'];
    this.medicalTransferCoverage = data['Medical Transfer Coverage'];
    this.returnToPermanentResidenceAfterTreatment =
      data['Return to Permanent Residence after Treatment'];
    this.repatriationOfMortalRemains = data['Repatriation of Mortal Remains'];
    this.medicalInformationAndConsultation =
      data['Medical Information and Consultation'];
  }
}

export class ProductInfosDto {
  productId: number;
  price: string;
  productName: string;
  productNameMultiple: {
    en: string;
    ar: string;
    ru: string;
    de: string;
  };
  productDescription: string;
  productCategoryTitle: string;
  productCategoryDescription: string;
  productCategoryMultiple: {
    en: string;
    ar: string;
    ru: string;
    de: string;
  };
  guarantees: GuaranteesDto;

  constructor(data: ProductInfos) {
    this.productId = data.urunId;
    this.price = data.fiyat;
    this.productName = data.urunAdi;
    this.productNameMultiple = data.urunAdiMultiple;
    this.productDescription = data.urunTanimi;
    this.productCategoryTitle = data.urunKategoriBaslik;
    this.productCategoryDescription = data.urunKategoriAciklama;
    this.productCategoryMultiple = data.urunKategoriMultiple;
    this.guarantees = new GuaranteesDto(data.teminatlar.en);
  }
}

export class PersonalInfosDto {
  firstName: string;
  lastName: string;
  idNumber: string;
  birthDate: string;
  gender: string;
  phoneNumber: string;
  email: string;

  constructor(data: PersonalInfos) {
    this.firstName = data.ad;
    this.lastName = data.soyad;
    this.idNumber = data.tcKimlikNo;
    this.birthDate = data.dogumTarihi;
    this.gender = data.cinsiyet;
    this.phoneNumber = data.gsmNo;
    this.email = data.email;
  }
}

export class InsuranceCompanyInfosDto {
  insuranceCompanyId: number;
  shortName: string;
  fullName: string;
  publisher: string;
  publisherMultiple: {
    en: string;
    ar: string;
    ru: string;
    de: string;
  };

  constructor(data: InsuranceCompanyInfos) {
    this.insuranceCompanyId = data.sigortaSirketiId;
    this.shortName = data.kisaAdi;
    this.fullName = data.tamAdi;
    this.publisher = data.yayinci;
    this.publisherMultiple = data.yayinciMultiple;
  }
}

export class GetPriceResponseDto {
  success: boolean;
  data: {
    productInfos: ProductInfosDto;
    personalInfos: PersonalInfosDto;
    insuranceCompanyInfos: InsuranceCompanyInfosDto;
  };

  constructor(response: GetPriceResponse) {
    this.success = response.success;
    this.data = {
      productInfos: new ProductInfosDto(response.data.urunBilgileri),
      personalInfos: new PersonalInfosDto(response.data.kisiselBilgiler),
      insuranceCompanyInfos: new InsuranceCompanyInfosDto(
        response.data.sigortaSirketiBilgileri,
      ),
    };
  }
}
