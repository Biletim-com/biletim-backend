import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class StopPointSearchQueryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
