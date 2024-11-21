import { ApiProperty } from '@nestjs/swagger';
import {
  InsuredPersonDto,
  PersonalInfoDTO,
} from './create-offer-travel-health-insurance.dto';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CreateOfferTicketCancellationProtectionInsuranceeResponse,
  ProductInfos,
} from '../types/create-offer-ticket-cancellation-protection-insurance.type';
import { InsuranceCompanyInfosDto } from './get-price-travel-health-insurance.dto';
import { Guarantees } from '../types/create-offer-travel-health-insurance.type';

export class CreateOfferTicketCancellationProtectionInsuranceRequestDto {
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
    description: 'The offer id.',
    example: '53',
  })
  @IsInt()
  @IsNotEmpty()
  offerId: number;
}

export class CreateOfferTicketCancellationProtectionInsuranceRequestDtoInTurkish {
  sigortaEttiren: {
    tcKimlikNo: string;
    dogumTarihi: string;
  };
  sigortali: Array<{
    tcKimlikNo: string;
    dogumTarihi: string;
  }>;
  email: string;
  gsmNo: string;
  teklifId: number;
}

export class GuaranteesDto {
  tr: Record<string, any>;
  en: Record<string, any>;

  constructor(data: Guarantees) {
    this.tr = data.tr;
    this.en = data.en;
  }
}

export class CreateOfferProductInfosTicketCancellationProtectionInsuranceDTO {
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

  constructor(data: ProductInfos) {
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

    this.guarantees = {
      tr: Object.keys(data.teminatlar.tr),
      en: Object.keys(data.teminatlar.en),
    };
  }
}

export class CreateOfferTicketCancellationProtectionInsuranceResponseDto {
  success: boolean;
  data: {
    offerInfo: {
      price: string;
      offerId: number;
      creationDate: string;
    };
    productInfos: CreateOfferProductInfosTicketCancellationProtectionInsuranceDTO;
    personalInfo: PersonalInfoDTO;
    insuranceCompanyInfos: InsuranceCompanyInfosDto;
  };

  constructor(data: CreateOfferTicketCancellationProtectionInsuranceeResponse) {
    this.success = data.success;
    this.data = {
      offerInfo: {
        offerId: data.data.teklifBilgileri.teklifId,
        price: data.data.teklifBilgileri.fiyat,
        creationDate: data.data.teklifBilgileri.olusturulmaTarihi,
      },
      productInfos:
        new CreateOfferProductInfosTicketCancellationProtectionInsuranceDTO(
          data.data.urunBilgileri,
        ),
      personalInfo: new PersonalInfoDTO(data.data.kisiselBilgiler),
      insuranceCompanyInfos: new InsuranceCompanyInfosDto(
        data.data.sigortaSirketiBilgileri,
      ),
    };
  }
}
