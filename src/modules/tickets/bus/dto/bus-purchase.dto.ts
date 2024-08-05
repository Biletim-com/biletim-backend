import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { BusPassengerInfoDto } from './bus-passenger-info.dto';
import { BusWebPassengerDto } from './bus-web-passenger.dto';
import { Type } from 'class-transformer';

// types
import { DateISODate, DateTime } from '@app/common/types';

// purchase
export class BusPurchaseDto {
  @IsString()
  @IsOptional()
  companyNo?: string;

  @IsInt()
  @IsNotEmpty()
  departurePointId: number;

  @IsInt()
  @IsNotEmpty()
  arrivalPointId: number;

  @IsDateString({}, { message: 'Date must be in the format yyyy-MM-dd' })
  @IsNotEmpty()
  date: DateISODate;

  @IsDateString()
  @IsNotEmpty()
  time: DateTime;

  @IsInt()
  @IsNotEmpty()
  routeNumber: number;

  @IsString()
  @IsNotEmpty()
  tripTrackingNumber: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => BusPassengerInfoDto)
  passengers: BusPassengerInfoDto[];

  @IsString()
  @IsNotEmpty()
  @Length(10, 10, {
    message: 'phone Number must be 10 characters length',
  })
  phoneNumber: string;

  @IsPositive()
  @IsNotEmpty()
  totalTicketPrice: number;

  @ValidateNested()
  @Type(() => BusWebPassengerDto)
  webPassenger: BusWebPassengerDto;
}
