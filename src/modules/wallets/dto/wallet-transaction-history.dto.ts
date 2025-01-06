import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

import { PaginationDto } from '@app/common/dtos';
import { DateISODate } from '@app/common/types';

export class WalletTransactionHistoryDto extends PaginationDto {
  @ApiProperty({
    description: 'Start date for filtering transactions. Format: YYYY-MM-DD',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: DateISODate;

  @ApiProperty({
    description: 'End date for filtering transactions. Format: YYYY-MM-DD',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: DateISODate;
}
