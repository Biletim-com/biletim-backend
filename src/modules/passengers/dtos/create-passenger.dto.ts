import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsEmail,
  IsDateString,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// types
import { DateISODate } from '@app/common/types';

// enums
import { Gender } from '@app/common/enums';

// decorators
import { IsTCNumber } from '@app/common/decorators';

// dtos
import { PassengerPassportDto } from './passport.dto';

export class CreatePassengerDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ required: true, enum: Gender })
  @IsNotEmpty()
  @IsEnum(Gender, {
    message: `Must be a valid value: ${Object.values(Gender)}`,
  })
  gender: Gender;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'Format is YYYY-MM-DD',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsDateString()
  @MaxLength(10, { message: 'Only provide the date part: YYYY-MM-DD' })
  birthday: DateISODate;

  @ApiProperty({
    required: false,
    maxLength: 11,
    minLength: 11,
    type: String,
  })
  @IsOptional()
  @IsTCNumber()
  tcNumber: string;

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
