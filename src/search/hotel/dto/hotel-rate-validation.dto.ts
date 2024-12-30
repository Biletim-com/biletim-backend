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
    example: 'h-364cce9c-91ff-58d4-aaad-df3f6a659465',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  bookHash: string;

  @ApiProperty({
    description: 'Permissible Price Increase',
    example: 20,
    default: 0,
  })
  @Min(0)
  @Max(100)
  @IsInt()
  @IsOptional()
  @Transform(({ value }) =>
    value && !isNaN(Number(value)) ? Number(value) : value,
  )
  priceIncreasePercent: number;
}
