import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BusCompanyRequestDto {
  @ApiProperty({
    description: 'Company number (Optional)',
    example: '0',
    required: false,
  })
  @IsString()
  @IsOptional()
  companyNumber?: string;
}
