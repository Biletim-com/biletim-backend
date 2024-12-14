import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  Max,
  MinLength,
  IsOptional,
  IsInt,
} from 'class-validator';

export class HotelRateValidationRequestDto {
  @ApiProperty({
    description: 'Unique id of the rate. (Required)',
    example: 'someUniqueHashValue',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  hash: string;

  @ApiProperty({
    description: 'Permissible Price Increase',
    example: '20',
    required: false,
  })
  @Min(0)
  @Max(100)
  @IsInt()
  @IsOptional()
  @Transform(({ value }) =>
    value && !isNaN(Number(value)) ? Number(value) : value,
  )
  priceIncreasePercent?: number;
}
