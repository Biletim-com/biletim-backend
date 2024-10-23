import { IsInEnumKeys } from '@app/common/decorators';
import { FlightClassType, PlaneTravelType } from '@app/common/enums';
import { DateISODate } from '@app/common/types';
import { ApiProperty } from '@nestjs/swagger';
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

export class PlaneFlightScheduleRequestDto {
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
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD'))
  @IsDateString({}, { message: 'Date must be in the format yyyy-MM-dd' })
  departureDate: DateISODate;

  @ApiProperty({
    description: 'Return date in yyyy-MM-dd format',
    example: '2024-09-20',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD'))
  @IsDateString({}, { message: 'Date must be in the format yyyy-MM-dd' })
  returnDate: DateISODate;

  @Expose()
  @Transform(({ obj }) =>
    obj.returnDate ? PlaneTravelType.ROUNDTRIP : PlaneTravelType.ONEWAY,
  )
  @IsEnum(PlaneTravelType)
  travelType: PlaneTravelType;

  @ApiProperty({
    description: `The class type of the flight. If no class type is specified, all class types will be included in the search results.`,
    example: 'ECONOMY',
    required: false,
  })
  @IsOptional()
  @IsInEnumKeys(
    FlightClassType,
    {
      message: 'Flight class must be a valid enum key (ECONOMY, BUSINESS)',
    },
    true,
  )
  classType: FlightClassType;

  @ApiProperty({
    description: 'Flight destination',
    example: true,
    required: true,
  })
  @IsNotEmpty()
  isAbroad: boolean;

  @ApiProperty({
    description: 'Number of adults (12 years and older)',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  adultCount: number;

  @ApiProperty({
    description: 'Number of children (2 - 12 years old)',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  childCount: number;

  @ApiProperty({
    description: 'Number of babies (0 - 2 years old)',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  babyCount: number;

  @ApiProperty({
    description: 'Number of student passengers (13 - 24 years old)',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  studentCount: number;

  @ApiProperty({
    description: 'Number of elderly passengers (65 years and older)',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  olderCount: number;

  @ApiProperty({
    description: 'Number of military passengers.',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  militaryCount: number;

  @ApiProperty({
    description: 'Number of young passengers (12 - 24 years old)',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  youthCount: number;
}
