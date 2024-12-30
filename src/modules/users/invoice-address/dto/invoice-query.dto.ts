import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class InvoiceQueryDto {
  @ApiProperty({ description: 'Offset', example: '0' })
  @IsOptional()
  @IsString()
  offset?: string;

  @ApiProperty({ description: 'Limit', example: '10' })
  @IsOptional()
  @IsString()
  limit?: string;
}
