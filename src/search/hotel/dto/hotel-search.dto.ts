import { languages } from '@app/common/constants';
import { Language } from '@app/common/types/languages.type';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  language?: Language;
}
