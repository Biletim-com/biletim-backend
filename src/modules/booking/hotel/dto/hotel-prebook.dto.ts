import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class PrebookRequestDto {
  @ApiProperty({
    description: 'Unique id of the rate. (Required)',
    example: 'someUniqueHashValue',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  hash!: string;

  @ApiProperty({
    description:
      'The percentage by which the new price can be higher than the original price. (Optional)',
    example: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99)
  price_increase_percent?: number;
}
