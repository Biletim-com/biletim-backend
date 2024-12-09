import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class GetHotelsByIdsDto {
  @ApiProperty({ example: 'hotel_routeinn_oshu' })
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  ids: string[];
}
