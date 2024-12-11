import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

const languages = [
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
];

export class HotelSearchQueryDto {
  @ApiProperty({ example: 'antalya' })
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiProperty({
    example: 'en',
    enum: languages,
  })
  @IsOptional()
  @IsEnum(languages)
  language?: string;
}
