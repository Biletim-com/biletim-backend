import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

// dto
import { HotelAvailabilityRequestDto } from './hotel-availability-request.dto';

export class HotelPageRequestDto extends HotelAvailabilityRequestDto {
  @ApiProperty({
    description: 'Hotel id. (Required)',
    example: 'test_hotel',
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}
