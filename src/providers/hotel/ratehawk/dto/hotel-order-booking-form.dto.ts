import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class OrderBookingFormRequestDto {
  partner_order_id!: string;

  @ApiProperty({
    description:
      'Unique id of the rate (from the hotel page request) (Required) ',
    example: 'unique-book-hash',
  })
  @IsString()
  @Length(1, 256)
  book_hash!: string;

  @ApiProperty({
    description: 'Language of the reservation. Lower case required. (Required)',
    example: 'en',
  })
  @IsString()
  @Length(2, 2)
  language!: string;
}
