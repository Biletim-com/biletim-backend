import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import * as dayjs from 'dayjs';

// utils
import { normalizeDecimal } from '@app/common/utils';

// types
import { DateISODate, DateTime } from '@app/common/types';

// dtos
import { BankCardDto } from '@app/common/dtos/credit-card.dto';
import { PassportDto } from '@app/common/dtos';

// enums
import { Gender } from '@app/common/enums';

// decorators
import { IsTCNumber } from '@app/common/decorators';

export class BusPassengerInfoDto {
  @ApiProperty({
    description: 'Seat number assigned to the passenger.',
    example: '2',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  seatNumber: string;

  @ApiProperty({
    description: 'First name of the passenger.',
    example: 'John',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the passenger.',
    example: 'Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ValidateIf((o) => o.firstName && o.lastName)
  @Length(0, 20, {
    message:
      'The full name (combination of firstName and lastName) is longer than 20.',
  })
  get fullName() {
    return `${this.firstName}${this.lastName}`;
  }

  @ApiProperty({
    description: 'Gender of the passenger',
    required: true,
    enum: Gender,
  })
  @IsNotEmpty()
  @IsEnum(Gender, {
    message: `Must be a valid value: ${Object.values(Gender)}`,
  })
  gender: Gender;

  @ApiProperty({
    description: 'Indicates whether the passenger is a Turkish citizen.',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  isTurkishCitizen: boolean;

  @ApiProperty({
    description:
      'TR ID Number of the passenger, mandatory for Turkish citizens.',
    example: '12345678901',
    required: false,
  })
  @ValidateIf((o) => o.isTurkishCitizen === true)
  @IsTCNumber()
  @IsNotEmpty({
    message: 'TR ID Number is mandatory for Turkish citizens',
  })
  tcNumber?: string;

  @ApiProperty({
    description: 'The passport of the passenger.',
    required: false,
  })
  @IsNotEmpty()
  @ValidateNested()
  @ValidateIf((o) => o.isTurkishCitizen === false)
  @Type(() => PassportDto)
  passport?: PassportDto;
}

// purchase
export class BusTicketPurchaseDto {
  @ApiProperty({
    description: 'Company number identifying the bus company',
    example: '37',
    required: false,
  })
  @IsString()
  companyNumber: string;

  @ApiProperty({
    description: 'Departure terminal ID for the bus trip',
    example: '84',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  departureTerminalId: string;

  @ApiProperty({
    description: 'Arrival point ID for the bus trip',
    example: '738',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  arrivalTerminalId: string;

  @ApiProperty({
    description: 'Date and Time of the trip in the format YYYY-MM-ddTHH:mm:SS',
    example: '2024-09-20T15:00:00',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  travelStartDateTime: DateTime;

  @ApiProperty({
    description: 'Route number for the bus trip',
    example: '1',
    required: true,
  })
  @IsNumberString()
  @IsNotEmpty()
  routeNumber: string;

  @ApiProperty({
    description: 'Tracking number for the trip',
    example: '20470',
    required: true,
  })
  @IsNumberString()
  @IsNotEmpty()
  tripTrackingNumber: string;

  @ApiProperty({
    description: 'Total price of the tickets',
    example: '150.00',
    required: true,
  })
  @IsNumberString()
  @IsNotEmpty()
  @Transform(({ value }) => normalizeDecimal(value))
  totalTicketPrice: string;

  @ApiProperty({
    description: 'First name of the customer.',
    example: 'John',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the customer.',
    example: 'Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Contact email address of the person booking the ticket',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      'Contact phone number of the person booking the ticket. Must be 10 characters',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 10, {
    message: 'phone Number must be 10 characters length',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'List of passenger information',
    type: [BusPassengerInfoDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => BusPassengerInfoDto)
  passengers: BusPassengerInfoDto[];

  @ApiProperty({
    description: 'Bank card info',
    type: BankCardDto,
    required: true,
  })
  @ValidateNested()
  @Type(() => BankCardDto)
  bankCard: BankCardDto;

  get date(): DateISODate {
    return dayjs(this.travelStartDateTime).format('YYYY-MM-DD') as DateISODate;
  }

  get time(): DateTime {
    return this.travelStartDateTime as DateTime;
  }

  get foreignPassengerExists(): boolean {
    const turkishCitizens = this.passengers.filter(
      (passenger) => passenger.isTurkishCitizen,
    );
    return turkishCitizens.length !== this.passengers.length;
  }
}
