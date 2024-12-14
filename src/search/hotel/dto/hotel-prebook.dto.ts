import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class PrebookRequestDto {
  @ApiProperty({
    description: 'Unique id of the rate. (Required)',
    example: 'someUniqueHashValue',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  hash: string;
}
