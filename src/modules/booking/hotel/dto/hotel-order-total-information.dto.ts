import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class HotelOrderingDto {
  @ApiProperty({
    description: 'Ordering type (Required)',
    example: 'asc',
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['asc', 'desc'])
  ordering_type!: 'asc' | 'desc';

  @ApiProperty({
    description: 'Field to order by (Required)',
    example: 'created_at',
  })
  @IsNotEmpty()
  @IsString()
  @IsIn([
    'cancelled_at',
    'checkin_at',
    'checkout_at',
    'created_at',
    'free_cancellation_before',
    'payment_due',
    'payment_pending',
  ])
  ordering_by!: string;
}

export class PaginationDto {
  @ApiProperty({
    description: 'Number of items per page (Required)',
    example: 10,
  })
  @IsNotEmpty()
  @Min(1)
  @Max(50)
  @IsInt()
  page_size!: number;

  @ApiProperty({
    description: 'Page number (Required)',
    example: 1,
  })
  @IsNotEmpty()
  @Min(1)
  @IsInt()
  page_number!: number;
}

export class DateTimeRangeDto {
  @ApiProperty({
    description: 'Start date and time (Optional)',
    example: '2024-06-25T10:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  from_date?: string;

  @ApiProperty({
    description: 'End date and time (Optional)',
    example: '2024-06-26T10:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  to_date?: string;
}

export class DateRangeDto {
  @ApiProperty({
    description: 'Start date (Optional)',
    example: '2024-06-25',
  })
  @IsDate()
  @IsOptional()
  from_date?: string;

  @ApiProperty({
    description: 'End date (Optional)',
    example: '2024-06-26',
  })
  @IsDate()
  @IsOptional()
  to_date?: string;
}

export class SearchDto {
  @ApiProperty({
    description: 'Cancellation date range (Optional)',
    type: DateTimeRangeDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateTimeRangeDto)
  cancelled_at?: DateTimeRangeDto;

  @ApiProperty({
    description: 'Check-in date range (Optional)',
    type: DateRangeDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  checkin_at?: DateRangeDto;

  @ApiProperty({
    description: 'Check-out date range (Optional)',
    type: DateRangeDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  checkout_at?: DateRangeDto;

  @ApiProperty({
    description: 'Creation date range (Optional)',
    type: DateTimeRangeDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateTimeRangeDto)
  created_at?: DateTimeRangeDto;

  @ApiProperty({
    description: 'Free cancellation before date range (Optional)',
    type: DateTimeRangeDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateTimeRangeDto)
  free_cancellation_before?: DateTimeRangeDto;

  @ApiProperty({
    description: 'Modification date range (Optional)',
    type: DateTimeRangeDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateTimeRangeDto)
  modified_at?: DateTimeRangeDto;

  @ApiProperty({
    description: 'Order IDs (Optional)',
    type: [Number],
  })
  @IsOptional()
  @Type(() => Number)
  order_ids?: number[];

  @ApiProperty({
    description: 'Paid date range (Optional)',
    type: DateRangeDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  paid_at?: DateRangeDto;

  @ApiProperty({
    description: 'Partner order IDs (Optional)',
    type: [String],
  })
  @IsOptional()
  @Type(() => String)
  partner_order_ids?: string[];

  @ApiProperty({
    description: 'Payment due date range (Optional)',
    type: DateRangeDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  payment_due?: DateRangeDto;

  @ApiProperty({
    description: 'Payment pending date range (Optional)',
    type: DateRangeDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  payment_pending?: DateRangeDto;

  @ApiProperty({
    description: 'Source (Optional)',
    example: 'b2b-api',
  })
  @IsOptional()
  @IsString()
  @IsIn(['b2b-card', 'b2b-site', 'b2b-api', 'b2b-handmade'])
  source?: 'b2b-card' | 'b2b-site' | 'b2b-api' | 'b2b-handmade';

  @ApiProperty({
    description: 'Status (Optional)',
    example: 'completed',
  })
  @IsOptional()
  @IsString()
  @IsIn(['cancelled', 'completed', 'failed', 'noshow', 'rejected'])
  status?: 'cancelled' | 'completed' | 'failed' | 'noshow' | 'rejected';
}

export class OrderTotalInformationRequestDto {
  @ApiProperty({
    description: 'Ordering information (Required)',
    type: HotelOrderingDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => HotelOrderingDto)
  ordering!: HotelOrderingDto;

  @ApiProperty({
    description: 'Pagination information (Required)',
    type: PaginationDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination!: PaginationDto;

  @ApiProperty({
    description: 'Search criteria (Optional)',
    type: SearchDto,
  })
  @ValidateNested()
  @Type(() => SearchDto)
  @IsOptional()
  search?: SearchDto;

  @ApiProperty({
    description: 'Language code (Optional)',
    example: 'en',
  })
  @IsOptional()
  @IsString()
  @IsIn([
    'ar',
    'bg',
    'cs',
    'de',
    'el',
    'en',
    'es',
    'fr',
    'he',
    'hu',
    'it',
    'nl',
    'pl',
    'pt',
    'ro',
    'ru',
    'sr',
    'sq',
    'tr',
    'zh_CN',
    'pt_PT',
  ])
  language?: string;
}
