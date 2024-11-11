import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import * as dayjs from 'dayjs';

// utils
import { normalizeDecimal } from '@app/common/utils';

// types
import { DateISODate, DateTime, UUID } from '@app/common/types';

// dtos
import { BankCardDto } from '@app/common/dtos/credit-card.dto';
import { BusPassengerInfoDto } from '@app/modules/tickets/bus/dto/bus-passenger-info.dto';

// purchase
export class BusTicketPurchaseDto {
  @ApiProperty({
    description: 'Company number identifying the bus company',
    example: '37',
    required: false,
  })
  @IsString()
  companyNo: string;

  @ApiProperty({
    description: 'Departure terminal ID for the bus trip',
    example: 'fa975977-5dde-4eb3-81d4-135bfa832e55',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  departureTerminalId: UUID;

  @ApiProperty({
    description: 'Arrival point ID for the bus trip',
    example: '8447bc12-49d3-4dec-8e30-eb2a6638bec6',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  arrivalTerminalId: UUID;

  @ApiProperty({
    description: 'Date and Time of the trip in the format YYYY-MM-ddTHH:mm:SS',
    example: '2024-09-20T15:00:00',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  travelStartDateTime: DateTime;

  @ApiProperty({
    description: 'Route number for the bus trip',
    example: '1',
    required: true,
  })
  @IsNumberString()
  @IsNotEmpty()
  routeNumber: string;

  @ApiProperty({
    description: 'Tracking number for the trip',
    example: '20470',
    required: true,
  })
  @IsNumberString()
  @IsNotEmpty()
  tripTrackingNumber: string;

  @ApiProperty({
    description: 'Total price of the tickets',
    example: '150.00',
    required: true,
  })
  @IsNumberString()
  @IsNotEmpty()
  @Transform(({ value }) => normalizeDecimal(value))
  totalTicketPrice: string;

  @ApiProperty({
    description: 'First name of the customer.',
    example: 'John',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the customer.',
    example: 'Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Contact email address of the person booking the ticket',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      'Contact phone number of the person booking the ticket. Must be 10 characters',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 10, {
    message: 'phone Number must be 10 characters length',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'List of passenger information',
    type: [BusPassengerInfoDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => BusPassengerInfoDto)
  passengers: BusPassengerInfoDto[];

  @ApiProperty({
    description: 'Bank card info',
    type: BankCardDto,
    required: true,
  })
  @ValidateNested()
  @Type(() => BankCardDto)
  bankCard: BankCardDto;

  get date(): DateISODate {
    return dayjs(this.travelStartDateTime).format('YYYY-MM-DD') as DateISODate;
  }

  get time(): DateTime {
    return this.travelStartDateTime as DateTime;
  }

  get foreignPassengerExists(): boolean {
    const turkishCitizens = this.passengers.filter(
      (passenger) => passenger.isTurkishCitizen,
    );
    return turkishCitizens.length !== this.passengers.length;
  }
}
