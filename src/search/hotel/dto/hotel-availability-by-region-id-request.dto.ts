import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

// dto
import { HotelAvailabilityRequestDto } from './hotel-availability-request.dto';

export class HotelAvailabilityByRegionIdRequestDto extends HotelAvailabilityRequestDto {
  @ApiProperty({ description: 'Region ID (required)', example: 536 })
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  regionId: number;
}
