import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

// enums
import { OrderType } from '@app/common/enums';

export class OrderReturnStartRequestDto {
  @ApiProperty({
    description:
      'The unique reservation number (PNR for bus and plane tickets)',
    example: 'ABC123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  reservationNumber: string;

  @ApiProperty({
    description: 'Order type',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(OrderType)
  orderType: OrderType;

  @ApiProperty({
    description: "First Passenger's lastname",
    example: 'OZTURK',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  passengerLastName: string;
}
