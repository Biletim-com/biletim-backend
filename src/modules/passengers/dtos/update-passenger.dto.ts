import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsDateString,
  Length,
  IsNotIn,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// types
import { DateISODate } from '@app/common/types';

// enums
import { Gender } from '@app/common/enums';

// dtos
import { PassengerPassportDto } from './passport.dto';

export class UpdatePassengerDto {
  @ApiProperty({ required: false, nullable: false })
  @IsNotIn([null])
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false, nullable: false })
  @IsNotIn([null])
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false, nullable: false, enum: Gender })
  @IsNotIn([null])
  @IsOptional()
  @IsEnum(Gender, {
    message: `Must be a valid value: ${Object.values(Gender)}`,
  })
  gender?: Gender;

  @ApiProperty({ required: false, type: String })
  @IsNotIn([null])
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, type: String })
  @IsNotIn([null])
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Birthday of passanger (YYYY-MM-DD)',
    required: false,
    type: String,
  })
  @IsNotIn([null])
  @IsOptional()
  @IsDateString()
  @MaxLength(10, { message: 'Only provide the date part: YYYY-MM-DD' })
  birthday?: DateISODate;

  @ApiProperty({
    required: false,
    nullable: true,
    maxLength: 11,
    minLength: 11,
    type: String,
  })
  @IsNotIn([null])
  @IsOptional()
  @Length(11)
  tcNumber?: string;

  @ApiProperty({
    required: false,
    nullable: true,
    type: [PassengerPassportDto],
  })
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => PassengerPassportDto)
  passports?: Nullable<PassengerPassportDto[]>;
}
