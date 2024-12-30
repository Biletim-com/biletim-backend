import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class WalletTransactionHistoryDto {
  @ApiProperty({
    description: 'Start date for filtering transactions. Format: YYYY-MM-DD',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'End date for filtering transactions. Format: YYYY-MM-DD',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: 'Offset', example: '0' })
  @IsString()
  @IsOptional()
  offset?: string;

  @ApiProperty({ description: 'Limit', example: '10' })
  @IsString()
  @IsOptional()
  limit?: string;
}
