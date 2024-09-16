import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BusTerminalSearchQueryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
