import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// enums
import { Gender, PassengerType } from '@app/common/enums';

// dtos
import { BankCardDto } from '@app/common/dtos';
import { FlightSegmentDto } from '@app/modules/tickets/plane/dto/plane-pull-price-flight.dto';

// decoratos
import {
  IsTCNumber,
  IsValidPlanePassengerType,
  OnlyOneDefined,
} from '@app/common/decorators';

// types
import { DateISODate } from '@app/common/types';

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

class InvoiceDto {
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

class PassengerPassport {
  @ApiProperty({
    description: 'Passport country code',
    example: 'US',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  passportCountryCode?: string;

  @ApiProperty({
    description: 'Passport number.',
    example: 'A12345678',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  passportNumber?: string;

  @ApiProperty({
    description: 'Passport expiration date. (YYYY-MM-DD)',
    example: '2030-01-01',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  @MaxLength(10, { message: 'Only provide the date part: YYYY-MM-DD' })
  passportExpirationDate?: DateISODate;
}
export class PlanePassengerInfoDto {
  @ApiProperty({
    description: 'The first name of the passenger.',
    example: 'John',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the passenger.',
    example: 'Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Gender of the passenger.',
    required: true,
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({
    description: 'The birth date of the passenger in yyyy-MM-dd format.',
    example: '2000-01-01',
    required: true,
  })
  @IsNotEmpty()
  @IsDateString()
  @MaxLength(10, { message: 'Only provide the date part: YYYY-MM-DD' })
  birthday: DateISODate;

  @ApiProperty({
    description: 'The type of the passenger.',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(PassengerType)
  @IsValidPlanePassengerType()
  passengerType: PassengerType;

  @ApiProperty({
    description:
      'The Turkish ID number of the passenger. Must be 11 characters length.',
    example: '12345678901',
    required: false,
  })
  @IsNotEmpty()
  @ValidateIf((o) => !o.passport)
  @IsTCNumber()
  tcNumber?: string;

  @ApiProperty({
    description: 'The passport of the passenger.',
    type: PassengerPassport,
    required: false,
  })
  @IsNotEmpty()
  @ValidateNested()
  @ValidateIf((o) => !o.tcNumber)
  @Type(() => PassengerPassport)
  passport?: PassengerPassport;

  @ApiProperty({
    description: 'The net price of the ticket for the passenger.',
    example: '100.00',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  netPrice: string;

  @ApiProperty({
    description: 'The tax amount applicable to the passenger’s ticket.',
    example: '10.00',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  taxAmount: string;

  @ApiProperty({
    description: 'The service fee for the passenger’s ticket.',
    example: '5.00',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  serviceFee: string;
}

export class PlaneTicketPurchaseDto {
  @ApiProperty({
    description: 'The company number.',
    example: '1000',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  companyNo: string;

  @ApiProperty({
    description:
      'The phone number of the person purchasing the ticket. Must be 10 characters length.',
    example: '1234567890',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 10, {
    message: 'phone Number must be 10 characters length',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'The email address of the person purchasing the ticket.',
    example: 'emre.yilmaz@westerops.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The invoice details for the ticket purchase.',
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => InvoiceDto)
  invoice: InvoiceDto;

  @ApiProperty({
    description: 'The list of passengers for the ticket purchase.',
    type: [PlanePassengerInfoDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanePassengerInfoDto)
  passengers: PlanePassengerInfoDto[];

  @ApiProperty({
    description: 'The list of flight segments.',
    type: [FlightSegmentDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlightSegmentDto)
  segments: FlightSegmentDto[];

  @ApiProperty({
    description: 'Bank card info',
    type: BankCardDto,
    required: true,
  })
  @ValidateNested()
  @Type(() => BankCardDto)
  bankCard: BankCardDto;
}
