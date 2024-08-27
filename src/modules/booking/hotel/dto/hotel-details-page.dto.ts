import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class HotelDetailsPageRequestDto {
  @ApiProperty({
    description: 'Hotel id (Required)',
    example: 'kolin_hotel',
  })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({
    description: ' Language (Required)',
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
  @IsNotEmpty()
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
  language!: string;
}
