import { PlaneTravelType } from '@app/common/enums';
import { PlaneTicketOperationType } from '@app/common/enums/plane-ticket-operation-type.enum';
import { DateISODate } from '@app/common/types';
import { Expose, Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import * as dayjs from 'dayjs';

export class PlaneDomesticFlightScheduleRequestDto {
  @IsString()
  @IsOptional()
  companyNo: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  departureAirport: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  arrivalAirport: string;

  @IsNotEmpty()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD'))
  @IsDateString({}, { message: 'Date must be in the format yyyy-MM-dd' })
  departureDate: DateISODate;

  @IsOptional()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD'))
  @IsDateString({}, { message: 'Date must be in the format yyyy-MM-dd' })
  returnDate?: DateISODate;

  @Expose()
  @Transform(({ obj }) =>
    obj.returnDate ? PlaneTravelType.ROUNDTRIP : PlaneTravelType.ONEWAY,
  )
  @IsEnum(PlaneTravelType)
  travelType: PlaneTravelType;

  @IsEnum(PlaneTicketOperationType)
  operationType: PlaneTicketOperationType;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  adultCount: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  childCount = 0;

  @IsOptional()
  @IsInt()
  @Min(0)
  babyCount = 0;

  @IsNotEmpty()
  @IsString()
  ip: string;
}
