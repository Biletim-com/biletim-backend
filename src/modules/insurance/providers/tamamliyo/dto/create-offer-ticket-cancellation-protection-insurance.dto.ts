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
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CreateOfferTicketCancellationProtectionInsuranceeResponse,
  En,
  Guarantees,
  ProductInfos,
  Tr,
} from '../types/create-offer-ticket-cancellation-protection-insurance.type';
import { InsuranceCompanyInfosDto } from './get-price-travel-health-insurance.dto';

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
  tr: Tr;
  en: En;

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
    this.guarantees = new GuaranteesDto(data.teminatlar);
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
