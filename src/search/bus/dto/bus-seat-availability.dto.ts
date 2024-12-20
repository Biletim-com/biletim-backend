import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
  constructor(
    dtoClassProperties: Omit<BusSeatAvailabilityRequestDto, 'date' | 'time'>,
  ) {
    Object.assign(this, dtoClassProperties);
  }

  @ApiProperty({
    description: 'Company number',
    example: '37',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  companyNumber: string;

  @ApiProperty({
    description: 'The departure point ID, which is a required field.',
    example: '84',
    required: true,
  })
  @IsInt()
  @IsNotEmpty()
  departurePointId: string;

  @ApiProperty({
    description: 'The arrival point ID, which is a required field.',
    example: '738',
    required: true,
  })
  @IsInt()
  @IsNotEmpty()
  arrivalPointId: string;

  @ApiProperty({
    description: 'Date of the trip in the format YYYY-MM-ddTHH:mm.SS',
    example: '2024-09-20T15:00:00',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  travelStartDateTime: DateTime;

  @ApiProperty({
    description: 'The route number for the bus, required field.',
    example: '3',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  routeNumber: string;

  @ApiProperty({
    description: 'The trip tracking number.',
    example: '2221',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tripTrackingNumber: string;

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

  get date(): DateISODate {
    return dayjs(this.travelStartDateTime).format('YYYY-MM-DD') as DateISODate;
  }

  get time(): DateTime {
    return this.travelStartDateTime as DateTime;
  }
}
