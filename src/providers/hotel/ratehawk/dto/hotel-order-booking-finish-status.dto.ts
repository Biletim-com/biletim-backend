import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class OrderBookingFinishStatusRequestDto {
  @ApiProperty({
    description: 'Reservation number of the booking ',
    example: '1000',
  })
  @IsNumberString()
  @IsNotEmpty()
  partnerOrderId: string;

  @ApiProperty({
    description: 'Comment',
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
