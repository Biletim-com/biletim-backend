import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class HotelOrderCancelRequestDto {
  @ApiProperty({
    description:
      'Id (UUID) of the booking (at the partner) made by the partner (Required)',
    example: 'unique-partner-order-id',
  })
  @IsString()
  @Length(1, 256)
  @IsNotEmpty()
  partner_order_id: string;
}
