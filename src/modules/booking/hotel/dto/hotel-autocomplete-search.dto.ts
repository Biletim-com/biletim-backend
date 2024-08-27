import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AutocompleteRequestDto {
  @ApiProperty({ example: 'hotel' })
  @IsString()
  @IsNotEmpty()
  query!: string;

  @ApiProperty({
    example: 'en',
    enum: [
      'ar',
      'bg',
      'de',
      'el',
      'en',
      'es',
      'fr',
      'it',
      'hu',
      'pl',
      'pt',
      'ro',
      'ru',
      'sr',
      'sq',
      'tr',
    ],
  })
  @IsString()
  @IsOptional()
  @IsEnum([
    'ar',
    'bg',
    'de',
    'el',
    'en',
    'es',
    'fr',
    'it',
    'hu',
    'pl',
    'pt',
    'ro',
    'ru',
    'sr',
    'sq',
    'tr',
  ])
  language?: string;
}

export class AutocompleteHotel {
  id: string;
  name: string;
  regionId: number;
}

export class AutocompleteRegion {
  id: number;
  name: string;
  type: string;
  countryCode: string;
}

export class AutocompleteResponseDto {
  constructor(
    public result: Array<{
      hotels: AutocompleteHotel[];
      regions: AutocompleteRegion[];
    }>,
  ) {}
}
