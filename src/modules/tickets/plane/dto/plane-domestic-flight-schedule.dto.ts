import { PlaneTravelType } from '@app/common/enums';
import { PlaneTicketOperationType } from '@app/common/enums';
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
  MaxLength,
  Min,
} from 'class-validator';

import { IsInEnumKeys } from '@app/common/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class PlaneDomesticFlightScheduleRequestDto {
  @ApiProperty({
    description: 'Three-letter code of the departure airport',
    example: 'ESB',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  departureAirport: string;

  @ApiProperty({
    description: 'Three-letter code of the arrival airport',
    example: 'KCM',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  arrivalAirport: string;

  @ApiProperty({
    description: 'Departure date in yyyy-MM-dd format',
    example: '2024-09-15',
    required: true,
  })
  @IsNotEmpty()
  @IsDateString()
  @MaxLength(10, { message: 'Only provide the date part: YYYY-MM-DD' })
  departureDate: DateISODate;

  @ApiProperty({
    description: 'Return date in yyyy-MM-dd format',
    example: '2024-09-20',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  @MaxLength(10, { message: 'Only provide the date part: YYYY-MM-DD' })
  returnDate: DateISODate;

  @Expose()
  @Transform(({ obj }) =>
    obj.returnDate ? PlaneTravelType.ROUNDTRIP : PlaneTravelType.ONEWAY,
  )
  @IsEnum(PlaneTravelType, {
    message: `Must be a valid value: ${Object.values(PlaneTravelType)}`,
  })
  travelType: PlaneTravelType;

  @ApiProperty({
    description: 'Operation type, either PURCHASE or RESERVATION',
    example: 'SALE',
    required: true,
  })
  @IsNotEmpty()
  @IsInEnumKeys(PlaneTicketOperationType, {
    message: 'Operation type must be valid key (PURCHASE or RESERVATION) ',
  })
  operationType: PlaneTicketOperationType;

  @ApiProperty({
    description: 'Number of adults',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  adultCount: number;

  @ApiProperty({
    description: 'Number of children',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  childCount = 0;

  @ApiProperty({
    description: 'Number of babies',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  babyCount = 0;

  @ApiProperty({
    description: 'IP address of the requester',
    example: '127.0.0.1',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  ip: string;
}
