import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { GuestDto } from './hotel-search-reservation-by-region-id.dto';
import { DateISODate } from '@app/common/types';

export class SearchReservationByHotelRequestDto {
  @ApiProperty({
    description: 'Check-in date (Required)',
    example: '2024-12-14',
  })
  @IsNotEmpty()
  checkin!: DateISODate;

  @ApiProperty({
    description: 'Check-out date (Required)',
    example: '2024-12-16',
  })
  @IsNotEmpty()
  checkout!: DateISODate;

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
  guests: GuestDto[];

  @ApiProperty({
    description: 'Hotel id. (Required)',
    example: 'test_hotel',
  })
  @IsNotEmpty()
  @IsString()
  id!: string;

  @ApiProperty({
    description: "Currency of the rooms' price in the response. (Optional)",
    example: 'TRY',
  })
  @IsOptional()
  @IsString()
  currency?: string;
}
