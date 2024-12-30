import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class GuestDto {
  @ApiProperty({ description: 'Number of adults', example: 2, type: 'number' })
  @IsInt()
  adults: number;

  @ApiProperty({
    description: 'Ages of children',
    example: [5, 7],
    type: 'array',
  })
  @IsArray()
  @IsInt({ each: true })
  children: number[];
}
