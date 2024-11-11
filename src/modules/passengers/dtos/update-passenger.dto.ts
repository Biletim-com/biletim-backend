import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsDateString,
  Length,
  IsNotIn,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { DateISODate, DateTime } from '@app/common/types';
import { Gender } from '@app/common/enums';

export class UpdatePassengerDto {
  @ApiProperty({ required: false, nullable: false })
  @IsNotIn([null])
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, nullable: false })
  @IsNotIn([null])
  @IsOptional()
  @IsString()
  familyName?: string;

  @ApiProperty({ required: false, nullable: false, enum: Gender })
  @IsNotIn([null])
  @IsOptional()
  @IsEnum(Gender, {
    message: `Must be a valid value: ${Object.values(Gender)}`,
  })
  gender?: Gender;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: Nullable<string>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: Nullable<string>;

  @ApiProperty({
    description: 'Birthday of passanger (YYYY-MM-DD)',
    required: false,
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
  })
  @IsOptional()
  @Length(11)
  tcNumber?: Nullable<string>;
}
