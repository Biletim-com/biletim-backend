import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OrderReturnValidationRequestDto {
  @ApiProperty({
    description: 'The unique PNR number',
    example: 'ABC123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  pnrNumber: string;

  @ApiProperty({
    description: "First Passenger's lastname",
    example: 'OZTURK',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  passengerLastName: string;
}
