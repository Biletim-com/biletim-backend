import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class InsuredPersonDto {
  @ApiProperty({
    description: 'TC identification number of the insured person.',
    example: '2xxxxxxxxxx',
  })
  @IsString()
  @IsNotEmpty()
  citizenshipNumber: string;

  @ApiProperty({
    description: 'Birthdate of the insured person in YYYY-MM-DD format.',
    example: '19xx-0x-20',
  })
  @IsDateString({}, { message: 'Birthdate must be in the format yyyy-MM-dd' })
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty({
    description:
      'If provider is owner then must be use F or for children C or for wife C AND just use this property if domestic travel',
    example: 'F | E | C ',
  })
  @IsOptional()
  relationTypeId?: string;
}

export class TravelHealthInsuranceRequestDto {
  @ApiProperty({
    description: 'Personal identification number of the insurance provider.',
    example: '2xxxxxxxxxx',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  providerCitizenshipNumber: string;

  @ApiProperty({
    description: 'Birthdate of the insurance provider in YYYY-MM-DD format.',
    example: '19xx-0x-20',
    required: true,
  })
  @IsDateString({}, { message: 'Birthdate must be in the format yyyy-MM-dd' })
  @IsNotEmpty()
  providerBirthDate: string;

  @ApiProperty({
    description: 'List of insured persons (policy holders).',
    type: [InsuredPersonDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InsuredPersonDto)
  @IsNotEmpty()
  insured: InsuredPersonDto[];

  @ApiProperty({
    description: 'Start date of the insurance policy.',
    example: '2023-09-10',
    required: true,
  })
  @IsDateString({}, { message: 'Start date must be in the format yyyy-MM-dd' })
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'End date of the insurance policy.',
    example: '2023-09-29',
    required: true,
  })
  @IsDateString({}, { message: 'End date must be in the format yyyy-MM-dd' })
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    description: 'Email address for the insurance request.',
    example: 'yazilim@tamamliyo.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Mobile phone number for contact.',
    example: '535xxxxxx',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Product type (e.g., international travel insurance).',
    example: 'yurtdisi-seyahat',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  productType: string;

  @ApiProperty({
    description: 'Country code of the insured country.',
    example: 276,
    required: true,
  })
  @IsInt()
  @IsNotEmpty()
  countryCode: number;
}

export class TravelHealthInsuranceRequestDtoInTurkish {
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
  ulkeKodu: number;
}
