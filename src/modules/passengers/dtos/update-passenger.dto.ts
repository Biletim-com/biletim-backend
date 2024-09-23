import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsDateString,
  Length,
  IsNotIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { DateTime } from '@app/common/types';
import { Gender } from '@app/common/enums';

export class UpdatePassengerDto {
  @ApiProperty({ required: false, nullable: false })
  @IsNotIn([null])
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  middleName?: Nullable<string>;

  @ApiProperty({ required: false, nullable: false })
  @IsNotIn([null])
  @IsOptional()
  @IsString()
  familyName?: string;

  @ApiProperty({ required: false, nullable: false })
  @IsNotIn([null])
  @IsOptional()
  @IsEnum(Gender)
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
    description: 'Birthday of passanger (ISO8601)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  birthday?: Nullable<DateTime>;

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
