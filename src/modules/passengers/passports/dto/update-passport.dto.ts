import {
  IsString,
  IsOptional,
  IsDateString,
  IsNotIn,
  MaxLength,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { DateISODate } from '@app/common/types';
import { passportCountryCodes } from '@app/common/constants';

export class UpdatePassportDto {
  @ApiProperty({ required: false, nullable: false })
  @IsNotIn([null])
  @IsOptional()
  @IsString()
  number: string;

  @ApiProperty({ required: false, nullable: false })
  @IsNotIn([null])
  @IsOptional()
  @IsIn(passportCountryCodes)
  country: string;

  @ApiProperty({
    description: 'Format is (YYYY-MM-DD)',
    example: '2030-01-01',
    required: false,
    nullable: false,
  })
  @IsNotIn([null])
  @IsOptional()
  @IsDateString()
  @MaxLength(10, { message: 'Only provide the date part: YYYY-MM-DD' })
  expirationDate: DateISODate;
}
