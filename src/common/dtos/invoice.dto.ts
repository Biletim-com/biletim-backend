import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

import { IsTCNumber, OnlyOneDefined } from '../decorators';

class IndividualInvoiceDto {
  @ApiProperty({
    description:
      'First name of the individual for the invoice (if applicable).',
    example: 'John',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the individual for the invoice (if applicable).',
    example: 'Doe',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description:
      'Turkish ID number of the individual for the invoice (if applicable).',
    example: '12345678901',
    required: false,
  })
  @IsNotEmpty()
  @IsTCNumber()
  tcNumber: string;

  @ApiProperty({
    description: 'Address of the individual for the invoice (if applicable).',
    example: '123 Main Street, Istanbul',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  address: string;
}

class CompanyInvoiceDto {
  @ApiProperty({
    description: 'Name of the company for the invoice (if applicable).',
    example: 'Westerops',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Address of the company for the invoice (if applicable).',
    example: '456 Business Park, Ankara',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Tax number of the company for the invoice (if applicable).',
    example: '1234567890',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  taxNumber: string;

  @ApiProperty({
    description: 'Tax office of the company for the invoice (if applicable).',
    example: 'Ankara Tax Office',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  taxOffice?: string;
}

export class InvoiceDto {
  @ApiProperty({
    description: 'Invoice issued for an individual',
    required: false,
  })
  @IsOptional()
  @Type(() => IndividualInvoiceDto)
  individual: IndividualInvoiceDto;

  @ApiProperty({
    description: 'Invoice issued for a company',
    required: false,
  })
  @IsOptional()
  @Type(() => CompanyInvoiceDto)
  company: CompanyInvoiceDto;

  @OnlyOneDefined(['individual', 'company'], {
    message: 'Exactly one of individual or company must be defined.',
  })
  private onlyOneDefined: boolean;
}
