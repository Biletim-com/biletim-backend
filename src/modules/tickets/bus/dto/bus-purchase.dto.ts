import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import * as dayjs from 'dayjs';

import { BusPassengerInfoDto } from './bus-passenger-info.dto';
import { BusWebPassengerDto } from './bus-web-passenger.dto';

// types
import { DateISODate, DateTime } from '@app/common/types';
import { ApiProperty } from '@nestjs/swagger';

// purchase
export class BusPurchaseDto {
  @ApiProperty({
    description: 'Company number identifying the bus company.',
    example: '37',
    required: false,
  })
  @IsString()
  @IsOptional()
  companyNo?: string;

  @ApiProperty({
    description: 'Departure point ID for the bus trip.',
    example: '84',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  departurePointId: string;

  @ApiProperty({
    description: 'Arrival point ID for the bus trip.',
    example: '738',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  arrivalPointId: string;

  @ApiProperty({
    description: 'Date of the trip in the format yyyy-MM-dd.',
    example: '2024-09-20',
    required: true,
  })
  @IsDateString({}, { message: 'Date must be in the format yyyy-MM-dd' })
  @IsNotEmpty()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD'))
  date: DateISODate;

  @ApiProperty({
    description: 'Time of the trip in the format yyyy-MM-ddTHH:mm:ss.',
    example: '2024-09-20T15:30:00',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  time: DateTime;

  @ApiProperty({
    description: 'Route number for the bus trip.',
    example: '1',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  routeNumber: string;

  @ApiProperty({
    description: 'Tracking number for the trip.',
    example: '20470',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tripTrackingNumber: string;

  @ApiProperty({
    description: 'List of passenger information.',
    type: [BusPassengerInfoDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => BusPassengerInfoDto)
  passengers: BusPassengerInfoDto[];

  @ApiProperty({
    description:
      'Contact phone number of the person booking the ticket.must be 10 characters.',
    example: '5550240045',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 10, {
    message: 'phone Number must be 10 characters length',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'Total price of the tickets.',
    example: 150,
    required: true,
  })
  @IsPositive()
  @IsNotEmpty()
  totalTicketPrice: number;

  @ApiProperty({
    description: 'Information about the web passenger booking the ticket.',
    type: BusWebPassengerDto,
    required: true,
  })
  @ValidateNested()
  @Type(() => BusWebPassengerDto)
  webPassenger: BusWebPassengerDto;
}
