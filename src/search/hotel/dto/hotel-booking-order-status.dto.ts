import { OrderStatus } from '@app/common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class HotelBookingOrderStatusRequestDto {
  @ApiProperty({
    description: 'Reservation number of the booking order',
    example: 1000,
  })
  @IsNumberString()
  @IsNotEmpty()
  reservationNumber: string;
}

export class HotelBookingOrderStatusResponseDto {
  status: OrderStatus;
}
