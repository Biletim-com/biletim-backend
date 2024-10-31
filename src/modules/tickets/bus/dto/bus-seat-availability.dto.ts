import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { DateISODate, DateTime } from '@app/common/types';
import * as dayjs from 'dayjs';

import { Gender } from '@app/common/enums';

class BusSeatDto {
  @ApiProperty({
    description: 'Seat number',
    example: '13',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  seatNumber: string;

  @ApiProperty({
    description: 'Gender of the passenger',
    required: true,
    enum: Gender,
  })
  @IsEnum(Gender, {
    message: `Must be a valid value: ${Object.values(Gender)}`,
  })
  @IsNotEmpty()
  gender: Gender;
}

// check wether the passenger can buy the requested ticket based on their gender
export class BusSeatAvailabilityRequestDto {
  @ApiProperty({
    description: 'Company number',
    example: '17',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  companyNo: string;

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
  @IsDateString({}, { message: 'Date must be in the format yyyy-MM-dd' })
  @IsNotEmpty()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD'))
  date: DateISODate;

  @ApiProperty({
    description: 'The travel date and time in the format yyyy-MM-ddTHH:mm:ss.',
    example: '2024-09-15T12:30:00',
    required: true,
  })
  @IsDateString(
    {},
    { message: 'Date must be in the format yyyy-MM-ddTHH:mm:ss' },
  )
  @IsNotEmpty()
  time: DateTime;

  @ApiProperty({
    description: 'The route number for the bus, required field.',
    example: '3',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  routeNumber: string;

  @IsInt()
  @IsOptional()
  operationType?: number;

  @ApiProperty({
    description: 'The trip tracking number.',
    example: '2221',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tripTrackingNumber: string;

  @ApiProperty({
    description: 'The IP address of the user making the request.',
    example: '127.0.0.1',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  ip = '127.0.0.1';

  @ApiProperty({
    description: 'List of seat information',
    type: [BusSeatDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusSeatDto)
  @IsNotEmpty()
  seats: BusSeatDto[];
}

export class BusSeatAvailabilityDto {
  isAvailable: boolean;

  constructor(isAvailable: boolean) {
    this.isAvailable = isAvailable;
  }
}
