import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import * as dayjs from 'dayjs';

// types
import { DateISODate, DateTime } from '@app/common/types/datetime.type';

// plate, driver...
export class BusTicketDetailRequestDto {
  constructor(data: Omit<BusTicketDetailRequestDto, 'date' | 'time'>) {
    Object.assign(this, data);
  }

  @ApiProperty({
    description: 'Company number',
    example: '0',
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
    description: 'Date and Time of the trip in the format YYYY-MM-ddTHH:mm:SS',
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

  get date(): DateISODate {
    return dayjs(this.travelStartDateTime).format('YYYY-MM-DD') as DateISODate;
  }

  get time(): DateTime {
    return this.travelStartDateTime as DateTime;
  }
}
