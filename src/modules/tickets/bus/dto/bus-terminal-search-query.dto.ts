import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BusTerminalSearchQueryDto {
  @ApiProperty({
    description:
      'The name of the bus terminal to search for. As each character is typed, the most matching results are returned from the database.',
    example: 'Adana',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
