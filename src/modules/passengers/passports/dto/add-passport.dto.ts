import {
  IsString,
  IsOptional,
  IsDateString,
  IsNotIn,
  MaxLength,
  IsIn,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { DateISODate, UUID } from '@app/common/types';
import { passportCountryCodes } from '@app/common/constants';

export class AddPassportBodyDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  number: string;

  @ApiProperty({ required: true, nullable: false })
  @IsNotIn([null])
  @IsOptional()
  @IsIn(passportCountryCodes)
  country: string;

  @ApiProperty({
    description: 'Format is (YYYY-MM-DD)',
    example: '2030-01-01',
    required: true,
    nullable: false,
  })
  @IsNotIn([null])
  @IsOptional()
  @IsDateString()
  @MaxLength(10, { message: 'Only provide the date part: YYYY-MM-DD' })
  expirationDate: DateISODate;
}

export class AddPassportDto {
  @ApiProperty({ required: true })
  @IsUUID()
  passengerId: UUID;

  @ApiProperty({
    required: false,
    nullable: true,
    type: AddPassportBodyDto,
  })
  @ValidateNested()
  @Type(() => AddPassportBodyDto)
  passport: AddPassportBodyDto;
}
