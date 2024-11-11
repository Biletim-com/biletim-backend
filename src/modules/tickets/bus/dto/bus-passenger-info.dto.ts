import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateIf,
} from 'class-validator';

// enums
import { Gender } from '@app/common/enums';
import { DateISODate } from '@app/common/types';
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
    description:
      'Passport country code, mandatory if the passenger is not a Turkish citizen.',
    example: 'US',
    required: false,
  })
  @ValidateIf((o) => o.isTurkishCitizen === false)
  @IsOptional()
  @IsString()
  passportCountryCode?: string;

  @ApiProperty({
    description:
      'Passport number, mandatory if the passenger is not a Turkish citizen.',
    example: 'A12345678',
    required: false,
  })
  @ValidateIf((o) => o.isTurkishCitizen === false)
  @IsOptional()
  @IsString()
  passportNumber?: string;

  @ApiProperty({
    description:
      'Passport expiration date, mandatory if the passenger is not a Turkish citizen. (YYYY-MM-DD)',
    example: '2030-01-01',
    required: false,
  })
  @ValidateIf((o) => o.isTurkishCitizen === false)
  @IsOptional()
  @IsDateString()
  @MaxLength(10, { message: 'Only provide the date part: YYYY-MM-DD' })
  passportExpirationDate?: DateISODate;
}
