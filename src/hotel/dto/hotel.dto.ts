import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsString,
  IsInt,
  IsArray,
  ValidateNested,
  IsNumberString,
  IsCurrency,
} from 'class-validator';
import { Type } from 'class-transformer';

class GuestDto {
  @ApiProperty({ description: 'Number of adults', example: 2 })
  @IsInt()
  adults: number;

  @ApiProperty({ description: 'Ages of children', example: [5, 7] })
  @IsArray()
  @IsInt({ each: true })
  children: number[];
}

export class SearchHotelsDto {
  @ApiProperty({ description: 'Check-in date', example: '2024-06-25' })
  @IsDateString()
  checkin: string;

  @ApiProperty({ description: 'Check-out date', example: '2024-06-26' })
  @IsDateString()
  checkout: string;

  @ApiProperty({ description: 'Residency code', example: 'gb' })
  @IsString()
  residency: string;

  @ApiProperty({ description: 'Language code', example: 'en' })
  @IsString()
  language: string;

  @ApiProperty({ description: 'List of guests', type: [GuestDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestDto)
  guests: GuestDto[];

  @ApiProperty({ description: 'Region ID', example: 536 })
  @IsInt()
  region_id: number;

  @ApiProperty({ description: 'Currency code', example: 'EUR' })
  @IsString()
  currency: string;
}
