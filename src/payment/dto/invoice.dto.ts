import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  ValidateNested,
  IsEmail,
  Length,
} from 'class-validator';

import { IsTCNumber, OnlyOneDefined } from '../../common/decorators';

class InvoiceContactDetails {
  @ApiProperty({
    description: 'Email address of the invoice owner',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'The phone number of the invoice owner. Must be 10 characters length.',
    example: '5555555555',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 10, {
    message: 'phone Number must be 10 characters length',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'Address of the individual for the invoice (if applicable).',
    example: '123 Main Street, Istanbul',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  address: string;
}

class IndividualInvoiceDto extends InvoiceContactDetails {
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
}

class CompanyInvoiceDto extends InvoiceContactDetails {
  @ApiProperty({
    description: 'Name of the company for the invoice (if applicable).',
    example: 'Westerops',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

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
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => IndividualInvoiceDto)
  individual: IndividualInvoiceDto;

  @ApiProperty({
    description: 'Invoice issued for a company',
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CompanyInvoiceDto)
  company: CompanyInvoiceDto;

  @OnlyOneDefined(['individual', 'company'], {
    message: 'Exactly one of individual or company must be defined.',
  })
  private onlyOneDefined: boolean;
}
