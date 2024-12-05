import {
  IsString,
  IsNotEmpty,
  IsDateString,
  MaxLength,
  IsIn,
  IsOptional,
  IsNotIn,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// types
import { DateISODate, UUID } from '@app/common/types';

// constants
import { passportCountryCodes } from '@app/common/constants';

export class PassengerPassportDto {
  @ApiProperty({ required: false })
  @IsNotIn([null])
  @IsOptional()
  @IsUUID()
  id?: UUID;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  number: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsIn(passportCountryCodes)
  country: string;

  @ApiProperty({
    description: 'Format is (YYYY-MM-DD)',
    example: '2030-01-01',
    required: true,
  })
  @IsNotEmpty()
  @IsDateString()
  @MaxLength(10, { message: 'Only provide the date part: YYYY-MM-DD' })
  expirationDate: DateISODate;
}
