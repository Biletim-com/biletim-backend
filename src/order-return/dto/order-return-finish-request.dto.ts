import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

// utils
import { UUID } from '@app/common/types';

export class OrderReturnFinishRequestDto {
  @ApiProperty({
    description: 'The unique PNR number',
    example: 'ABC123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  pnrNumber: UUID;

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
