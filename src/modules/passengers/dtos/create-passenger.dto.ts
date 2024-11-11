import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsEmail,
  IsDateString,
  Length,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { DateISODate, DateTime } from '@app/common/types';
import { Gender } from '@app/common/enums';

class CreatePassportDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  number: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
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

export class CreatePassengerDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  familyName: string;

  @ApiProperty({ required: true, enum: Gender })
  @IsNotEmpty()
  @IsEnum(Gender, {
    message: `Must be a valid value: ${Object.values(Gender)}`,
  })
  gender: Gender;

  @ApiProperty({ required: false, nullable: true, type: String })
  @IsOptional()
  @IsEmail()
  email?: Nullable<string>;

  @ApiProperty({ required: false, nullable: true, type: String })
  @IsOptional()
  @IsString()
  phone?: Nullable<string>;

  @ApiProperty({
    description: 'Format is YYYY-MM-DD',
    required: false,
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsDateString()
  @MaxLength(10, { message: 'Only provide the date part: YYYY-MM-DD' })
  birthday?: Nullable<DateISODate>;

  @ApiProperty({
    required: false,
    nullable: true,
    maxLength: 11,
    minLength: 11,
    type: String,
  })
  @IsOptional()
  @Length(11)
  tcNumber?: Nullable<string>;

  @ApiProperty({
    required: false,
    nullable: true,
    type: CreatePassportDto,
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => CreatePassportDto)
  passport?: Nullable<CreatePassportDto>;
}
