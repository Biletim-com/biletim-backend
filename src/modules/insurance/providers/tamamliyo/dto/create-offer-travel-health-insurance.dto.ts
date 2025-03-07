import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsEnum,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InsuranceProductType } from '@app/common/enums';
import {
  CreateOfferTravelHealthInsuranceResponse,
  Guarantees,
  PersonalInfo,
  ProductInfos,
} from '../types/create-offer-travel-health-insurance.type';
import { InsuranceCompanyInfos } from '../types/get-price-travel-health-insurance.type';
import { IsTCNumber } from '@app/common/decorators';

// DTO for the insured person information
export class InsuredPersonDto {
  @ApiProperty({
    description:
      'The Turkish Identity Number (TC Kimlik No) of the insured person.',
    example: '2xxxxxxxxxx',
  })
  @IsString()
  @IsNotEmpty()
  @IsTCNumber()
  tcNumber: string;

  @ApiProperty({
    description: 'The birth date of the insured person.',
    example: '19xx-0x-20',
  })
  @IsDateString()
  @IsNotEmpty()
  birthDate: string;
}

// Main Request DTO
export class CreateOfferTravelHealthInsuranceRequestDto {
  @ApiProperty({
    description:
      'Information about the policyholder (person who purchases the insurance).',
    type: InsuredPersonDto,
  })
  @ValidateNested()
  @Type(() => InsuredPersonDto)
  @IsNotEmpty()
  policyholder: InsuredPersonDto;

  @ApiProperty({
    description: 'List of insured persons under the policy.',
    type: [InsuredPersonDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InsuredPersonDto)
  @IsNotEmpty()
  insuredPersons: InsuredPersonDto[];

  @ApiProperty({
    description: 'Start date of the insurance policy.',
    example: '2024-12-10',
  })
  @IsDateString({}, { message: 'Start date must be in the format yyyy-MM-dd' })
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'End date of the insurance policy.',
    example: '2024-12-14',
  })
  @IsDateString({}, { message: 'End date must be in the format yyyy-MM-dd' })
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    description: 'The email address of the policyholder.',
    example: 'yazilim@tamamliyo.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The mobile phone number of the policyholder.',
    example: '535xxxxxx',
  })
  @Matches(/^[1-9]\d{2}\d{3}\d{4}$/, {
    message:
      'Phone number must be a 10-digit number starting with a non-zero digit.',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description:
      'The type of the insurance product (e.g., domestic or abroad travel insurance).',
    example: 'domestic-travel',
    enum: InsuranceProductType,
  })
  @IsEnum(InsuranceProductType, {
    message: 'Product type must be either domestic-travel or abroad-travel',
  })
  @IsNotEmpty()
  productType: InsuranceProductType;
}

export class CreateOfferTravelHealthInsuranceRequestDtoInTurkish {
  sigortaEttiren: {
    tcKimlikNo: string;
    dogumTarihi: string;
  };
  sigortali: Array<{
    tcKimlikNo: string;
    dogumTarihi: string;
  }>;
  baslangicTarihi: string;
  bitisTarihi: string;
  email: string;
  gsmNo: string;
  urun: string;
  ulkeKodu?: number;
  ilKodu?: number;
}

class GuaranteesDTO {
  tr: Record<string, any>;
  en: Record<string, any>;

  constructor(data: Guarantees) {
    this.tr = data.tr;
    this.en = data.en;
  }
}

class ProductInfosDTO {
  productId: number;
  price: string;
  priceUsd: string;
  priceEuro: string;
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
  guarantees: GuaranteesDTO;

  constructor(data: ProductInfos) {
    this.productId = data.urunId;
    this.price = data.fiyat;
    this.priceUsd = data.fiyatUsd;
    this.priceEuro = data.fiyatEuro;
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
    this.guarantees = new GuaranteesDTO(data.teminatlar);
  }
}

class PersonalInfoDTO {
  firstName: string;
  lastName: string;
  identityNumber: string;
  birthDate: string;
  gender: string;
  phoneNumber: string;
  email: string;

  constructor(data: PersonalInfo) {
    this.firstName = data.ad;
    this.lastName = data.soyad;
    this.identityNumber = data.tcKimlikNo;
    this.birthDate = data.dogumTarihi;
    this.gender = data.cinsiyet;
    this.phoneNumber = data.gsmNo;
    this.email = data.email;
  }
}

class InsuranceCompanyInfosDTO {
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

class CreateOfferTravelHealthInsuranceResponseDTO {
  success: boolean;
  data: {
    offerInfo: {
      price: string;
      priceUsd: string;
      priceEuro: string;
      offerId: number;
      creationDate: string;
    };
    productInfo: ProductInfosDTO;
    personalInfo: PersonalInfoDTO;
    insuranceCompanyInfo: InsuranceCompanyInfosDTO;
  };

  constructor(data: CreateOfferTravelHealthInsuranceResponse) {
    this.success = data.success;
    this.data = {
      offerInfo: {
        price: data.data.teklifBilgileri.fiyat,
        priceUsd: data.data.teklifBilgileri.fiyatUsd,
        priceEuro: data.data.teklifBilgileri.fiyatEuro,
        offerId: data.data.teklifBilgileri.teklifId,
        creationDate: data.data.teklifBilgileri.olusturulmaTarihi,
      },
      productInfo: new ProductInfosDTO(data.data.urunBilgileri),
      personalInfo: new PersonalInfoDTO(data.data.kisiselBilgiler),
      insuranceCompanyInfo: new InsuranceCompanyInfosDTO(
        data.data.sigortaSirketiBilgileri,
      ),
    };
  }
}

export {
  GuaranteesDTO,
  ProductInfosDTO,
  PersonalInfoDTO,
  InsuranceCompanyInfosDTO,
  CreateOfferTravelHealthInsuranceResponseDTO,
};
