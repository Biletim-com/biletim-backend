import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class OrderBookingFinishStatusRequestDto {
  @ApiProperty({
    description:
      'Id (UUID) of the booking (at the partner) made by the partner (Required)',
    example: 'unique-partner-order-id',
  })
  @IsString()
  @Length(1, 256)
  @IsNotEmpty()
  partnerOrderId: string;

  @ApiProperty({
    description: 'Comment (Optional)',
    example: 'This is a comment',
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(256)
  comment?: string;

  @IsOptional()
  @MinLength(1)
  amountSellB2b2c?: number;
}
