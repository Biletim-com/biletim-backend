import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsISO31661Alpha2,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';

// types
import { DateISODate } from '@app/common/types';

// dto
import { GuestDto } from './hotel-guest.dto';

// constants
import { languages } from '@app/common/constants';

// types
import { Language } from '@app/common/types/languages.type';

export class HotelAvailabilityRequestDto {
  @ApiProperty({
    description: 'Check-in date (Required)',
    required: true,
    example: '2024-12-24',
  })
  @IsDateString()
  @IsNotEmpty()
  checkin: DateISODate;

  @ApiProperty({
    description: 'Check-out date (Required)',
    required: true,
    example: '2024-12-27',
  })
  @IsDateString()
  @IsNotEmpty()
  checkout: DateISODate;

  @ApiProperty({
    description: 'Array of guests, including adults and children',
    type: String,
    example:
      '[{ "adults": 2, "children": [2, 3] },{ "adults": 1, "children": [] }]',
  })
  @IsArray()
  @ArrayMaxSize(9)
  @ValidateNested({ each: true })
  @Type(() => GuestDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const parsed = JSON.parse(value);
      return plainToInstance(
        GuestDto,
        Array.isArray(parsed) ? parsed : [parsed],
      );
    }
    return plainToInstance(GuestDto, value);
  })
  guests: GuestDto[];

  @ApiProperty({
    description: "Guest's (or multiple guests') citizenship",
    example: 'us',
    required: true,
  })
  @IsNotEmpty()
  @IsISO31661Alpha2()
  residency: string;

  @ApiProperty({
    example: 'en',
    required: true,
    enum: languages,
  })
  @IsNotEmpty()
  @IsEnum(languages)
  language: Language;
}
