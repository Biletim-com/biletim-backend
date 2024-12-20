import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BusTerminalSearchQueryDto {
  @ApiProperty({
    description: 'The name or the region of the bus terminal to search for.',
    example: 'Istanbul',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  searchTerm: string;
}
