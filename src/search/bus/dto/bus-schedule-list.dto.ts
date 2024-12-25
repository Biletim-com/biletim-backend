import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import * as dayjs from 'dayjs';

// types
import { DateISODate } from '@app/common/types';

// dto
import { IsAfter } from '@app/common/decorators';
import { Transform } from 'class-transformer';

// request to be sent to get the available dates
export class BusScheduleRequestDto {
  @IsString()
  @IsOptional()
  companyNumber?: string;

  @ApiProperty({
    description: 'The departure point ID, which is a required field.',
    example: '84',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  departurePointId: string;

  @ApiProperty({
    description: 'The arrival point ID, which is a required field.',
    example: '738',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  arrivalPointId: string;

  @ApiProperty({
    description: 'The travel date in the format "yyyy-MM-dd".',
    example: '2024-10-15',
    required: true,
  })
  @IsDateString()
  @MaxLength(10, { message: 'Only provide the date part: YYYY-MM-DD' })
  @IsNotEmpty()
  date: DateISODate;

  @ApiProperty({
    description: 'The return date in the format "yyyy-MM-dd" (optional).',
    example: '2024-10-28',
    required: false,
  })
  @IsDateString({}, { message: 'Return date must be in the format yyyy-MM-dd' })
  @IsOptional()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD'))
  @IsAfter('date', {
    message: 'Return date must be greater than date',
  })
  returnDate?: DateISODate;

  @IsInt()
  @IsOptional()
  includeIntermediatePoints?: number;
}
