import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PnrSearchRequestDto {
  @ApiProperty({
    description: 'The unique PNR number for the flight booking',
    example: 'ABC123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  pnrNumber: string;

  @ApiProperty({
    description: 'Search parameter for PNR, e.g., last name or phone number',
    example: 'Yilmaz',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  pnrSearcParameter: string;
}
