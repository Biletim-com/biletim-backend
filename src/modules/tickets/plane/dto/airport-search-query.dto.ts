import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AirportSearchQueryDto {
  @ApiProperty({
    description:
      'CountryName, CityName, AirportCode, AirportName of the airport to search for',
    example: 'GYD',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  searchText: string;
}
