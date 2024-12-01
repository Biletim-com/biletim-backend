import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// enums
import { Gender, PassengerType } from '@app/common/enums';

// dtos
import {
  BankCardDto,
  FlightSegmentDto,
  PassportDto,
  InvoiceDto,
} from '@app/common/dtos';

// decoratos
import { IsTCNumber, IsValidPlanePassengerType } from '@app/common/decorators';

// types
import { DateISODate } from '@app/common/types';

export class PlanePassengerInfoDto {
  constructor(passengerInfo: PlanePassengerInfoDto) {
    Object.assign(this, passengerInfo);
  }

  // this is for validating passenger type based on companies' age rule
  // IsValidPlanePassengerType decorator does the validation
  @IsNotEmpty()
  @IsString()
  private readonly companyNumber: string;

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
    required: false,
  })
  @IsNotEmpty()
  @ValidateNested()
  @ValidateIf((o) => !o.tcNumber)
  @Type(() => PassportDto)
  passport?: PassportDto;

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
  companyNumber: string;

  @ApiProperty({
    description:
      'The phone number of the person purchasing the ticket. Must be 10 characters length.',
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
    description: 'The email address of the person purchasing the ticket.',
    example: 'emre.yilmaz@westerops.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The invoice details for the ticket purchase.',
    required: true,
  })
  @IsNotEmpty()
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
  @Transform(({ value, obj }) =>
    value.map(
      (passanger) =>
        new PlanePassengerInfoDto({
          ...passanger,
          companyNumber: obj.companyNumber,
        }),
    ),
  )
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
