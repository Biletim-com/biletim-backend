import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsEmail,
  IsDateString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { DateTime } from '@app/common/types';
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

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsDateString()
  expirationDate: DateTime;
}

export class CreatePassengerDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false, nullable: true, type: String })
  @IsOptional()
  @IsString()
  middleName?: Nullable<string>;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  familyName: string;

  @ApiProperty({ required: true, enum: Gender })
  @IsNotEmpty()
  @IsEnum(Gender)
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
    description: 'Birthday of passanger (ISO8601)',
    required: false,
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsDateString()
  birthday?: Nullable<DateTime>;

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
