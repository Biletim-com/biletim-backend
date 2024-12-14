import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

// dto
import { HotelAvailabilityRequestDto } from './hotel-availability-request.dto';

export class HotelAvailabilityByHotelIdsRequestDto extends HotelAvailabilityRequestDto {
  @ApiProperty({
    description: 'List of hotels ids. (Required). Maximum 300 items.',
    example: ['test_hotel'],
  })
  @IsArray()
  @IsNotEmpty()
  @ArrayMaxSize(300)
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  ids: string[];
}
