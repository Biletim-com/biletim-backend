import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsDateString,
  MaxLength,
  IsIn,
  IsAlphanumeric,
  Length,
} from 'class-validator';

import { DateISODate, PassportCountryCode } from '../types';
import { IsNotInPast } from '../decorators';
import { passportCountryCodes } from '../constants/passport-country-codes.constant';

export class PassportDto {
  @ApiProperty({
    description: 'Passport country code',
    example: 'US',
    required: true,
  })
  @IsNotEmpty()
  @IsIn(passportCountryCodes)
  countryCode: PassportCountryCode;

  @ApiProperty({
    description: 'Passport number.',
    example: 'A12345678',
    required: true,
  })
  @IsNotEmpty()
  @Length(6, 24)
  @IsAlphanumeric()
  number: string;

  @ApiProperty({
    description: 'Passport expiration date. (YYYY-MM-DD)',
    example: '2030-01-01',
    required: true,
  })
  @IsNotInPast()
  @IsDateString()
  @IsNotEmpty()
  @MaxLength(10, { message: 'Only provide the date part: YYYY-MM-DD' })
  expirationDate: DateISODate;
}
