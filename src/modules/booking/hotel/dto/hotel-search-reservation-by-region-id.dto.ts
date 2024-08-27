import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

export class GuestDto {
  @ApiProperty({ description: 'Number of adults', example: 2 })
  @IsInt()
  adults: number;

  @ApiProperty({ description: 'Ages of children', example: [5, 7] })
  @IsArray()
  @IsInt({ each: true })
  children: number[];
}

export class searchReservationByRegionIdRequestDto {
  @ApiProperty({
    description: 'Check-in date (Required)',
    example: '2024-07-14',
  })
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  checkin!: Date;

  @ApiProperty({
    description: 'Check-out date (Required)',
    example: '2024-07-16',
  })
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  checkout!: Date;

  @ApiProperty({
    description: "Guest's (or multiple guests') citizenship. (Optional)",
    example: 'us',
  })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  residency?: string;

  @ApiProperty({
    description: 'Language. (Optional)',
    example: 'en',
    enum: [
      'ar',
      'bg',
      'cs',
      'de',
      'el',
      'en',
      'es',
      'fr',
      'he',
      'hu',
      'it',
      'nl',
      'pl',
      'pt',
      'ro',
      'ru',
      'sr',
      'sq',
      'tr',
      'zh_CN',
      'pt_PT',
    ],
  })
  @IsString()
  @IsOptional()
  @IsEnum([
    'ar',
    'bg',
    'cs',
    'de',
    'el',
    'en',
    'es',
    'fr',
    'he',
    'hu',
    'it',
    'nl',
    'pl',
    'pt',
    'ro',
    'ru',
    'sr',
    'sq',
    'tr',
    'zh_CN',
    'pt_PT',
  ])
  language?: string;

  @ApiProperty({
    description: 'List of guests. (Required)',
    type: [GuestDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestDto)
  guests!: GuestDto[];

  @ApiProperty({ description: 'Region ID (required)', example: 536 })
  @IsInt()
  @IsNotEmpty()
  region_id!: number;

  @ApiProperty({ description: 'Currency code (Optional)', example: 'EUR' })
  @IsString()
  @IsOptional()
  currency?: string;
}

export class QueryDto {
  @IsOptional()
  @IsNumberString({}, { message: 'minPrice must be a number' })
  minPrice?: number;

  @IsOptional()
  @IsNumberString({}, { message: 'maxPrice must be a number' })
  maxPrice?: number;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
