import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

// enumns
import { OrderType } from '@app/common/enums';

export class OrderReturnFinishRequestDto {
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

  @ApiProperty({
    description: 'The Verification Code',
    example: '123456',
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(100000)
  @Max(999999)
  verificationCode: number;
}
