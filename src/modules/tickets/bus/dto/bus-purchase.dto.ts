import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BusPassengerInfoDto } from './bus-passenger-info.dto';
import { BusWebPassengerDto } from './bus-web-passenger.dto';
import { Type } from 'class-transformer';

// purchase
export class BusPurchaseDto {
  @IsString()
  @IsOptional()
  companyNo?: string;

  @MinLength(2)
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  departurePointID: string;

  @MinLength(2)
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  arrivalPointID: string;

  @IsDateString({}, { message: 'Date must be in the format yyyy-MM-dd' })
  @IsNotEmpty()
  date: Date;

  @IsDateString(
    {},
    { message: 'Date must be in the format yyyy-MM-ddTHH:mm:ss' },
  )
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  routeNumber: string;

  @IsString()
  @IsNotEmpty()
  tripTrackingNumber: string;

  @IsArray()
  @Type(() => BusPassengerInfoDto)
  @IsNotEmpty()
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

  @IsString()
  @IsNotEmpty()
  passengerCount: string;

  @IsInt()
  @IsOptional()
  ticketSeriesNo?: number;

  @IsInt()
  @IsOptional()
  paymentType?: number;

  @IsInt()
  @IsOptional()
  travelType?: number;

  @IsArray()
  @Type(() => BusWebPassengerDto)
  webPassenger: BusWebPassengerDto;

  constructor(partial: Partial<BusPassengerInfoDto>) {
    Object.assign(this, partial);
    this.ticketSeriesNo = this.ticketSeriesNo ?? 1;
    this.paymentType = this.paymentType ?? 0;
    this.travelType = this.travelType ?? 0;
  }
}
