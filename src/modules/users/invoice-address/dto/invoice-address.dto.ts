import { InvoiceType } from '@app/common/enums';

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
  IsString,
  IsBoolean,
} from 'class-validator';

export class InvoiceAddressDto {
  @ApiProperty({
    description: 'The type of invoice, such as individual or corporate',
    example: InvoiceType.INDIVIDUAL,
    enum: InvoiceType,
  })
  @IsEnum(InvoiceType)
  @IsNotEmpty()
  type: InvoiceType;

  @ApiProperty({
    description: 'The full name associated with the invoice address',
    example: 'John Doe',
  })
  @ValidateIf((dto) => dto.type === InvoiceType.INDIVIDUAL)
  @IsNotEmpty()
  @IsString()
  fullName?: string;

  @ApiProperty({
    description: 'Unique identifier for the invoice address',
    example: '12345678901',
  })
  @ValidateIf(
    (dto) =>
      dto.type === InvoiceType.INDIVIDUAL ||
      (dto.type === InvoiceType.CORPORATE && dto.isPersonalCompany),
  )
  @IsNotEmpty()
  @IsString()
  identifier?: string;

  @ApiProperty({
    description: 'Country of the invoice address',
    example: 'USA',
  })
  @IsNotEmpty()
  @IsString()
  country?: string;

  @ApiProperty({
    description: 'City of the invoice address',
    example: 'New York',
  })
  @IsNotEmpty()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'District of the invoice address',
    example: 'Manhattan',
  })
  @ValidateIf((dto) => dto.country !== 'Turkey')
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({
    description: 'Detailed address for the invoice',
    example: '123 Main Street, Apt 4B',
  })
  @IsNotEmpty()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Postal code for the invoice address',
    example: '10001',
  })
  @ValidateIf(
    (dto) => dto.type === InvoiceType.CORPORATE || dto.country !== 'Turkey',
  )
  @IsNotEmpty()
  @IsString()
  postalCode?: string;

  @ApiProperty({
    description: 'Company name if applicable',
    example: 'Acme Corporation',
  })
  @ValidateIf((dto) => dto.type === InvoiceType.CORPORATE)
  @IsNotEmpty()
  @IsString()
  companyName?: string;

  @ApiProperty({
    description: 'Indicates if the invoice is for a personal company',
    example: true,
  })
  @ValidateIf((dto) => dto.type === InvoiceType.CORPORATE)
  @IsNotEmpty()
  @IsBoolean()
  isPersonalCompany?: boolean;

  @ApiProperty({
    description: 'Tax office associated with the invoice address',
    example: 'Downtown Tax Office',
  })
  @ValidateIf((dto) => dto.type === InvoiceType.CORPORATE)
  @IsNotEmpty()
  @IsString()
  taxOffice?: string;

  @ApiProperty({
    description: 'Tax number associated with the invoice address',
    example: '987654321',
  })
  @ValidateIf(
    (dto) =>
      dto.type === InvoiceType.CORPORATE && dto.isPersonalCompany === false,
  )
  @IsNotEmpty()
  @IsString()
  taxNumber?: string;
}
