import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OfficialHolidaysRequestDto {
  @ApiProperty({
    description: 'Year for which to get public holidays',
    example: '2024',
  })
  @IsNotEmpty()
  @IsString()
  year: string;
}
