import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import * as dayjs from 'dayjs';

// utils
import { normalizeDecimal } from '@app/common/utils';

// types
import { DateISODate, DateTime } from '@app/common/types';

// dtos
import { BankCardDto } from '@app/common/dtos/credit-card.dto';
import { PassengerInfoDto } from '@app/common/dtos';

// dtos
import { InvoiceDto } from '@app/common/dtos/invoice.dto';

class BusPassengerInfoDto extends PassengerInfoDto {
  @ApiProperty({
    description: 'Total price of the tickets',
    example: '40',
    required: true,
  })
  @IsNumberString()
  @IsNotEmpty()
  @Transform(({ value }) => normalizeDecimal(value))
  ticketPrice: string;

  @ApiProperty({
    description: 'Seat number assigned to the passenger.',
    example: '2',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  seatNumber: string;

  @ValidateIf((o) => o.firstName && o.lastName)
  @Length(0, 20, {
    message:
      'The full name (combination of firstName and lastName) is longer than 20.',
  })
  get fullName() {
    return `${this.firstName}${this.lastName}`;
  }
}

class BusTicketPurchaseTripDto {
  @ApiProperty({
    description: 'Company number identifying the bus company',
    example: '37',
    required: false,
  })
  @IsString()
  companyNumber: string;

  @ApiProperty({
    description: 'Departure terminal ID for the bus trip',
    example: '84',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  departureTerminalId: string;

  @ApiProperty({
    description: 'Arrival point ID for the bus trip',
    example: '738',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  arrivalTerminalId: string;

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
    example: '3',
    required: true,
  })
  @IsNumberString()
  @IsNotEmpty()
  routeNumber: string;

  @ApiProperty({
    description: 'Tracking number for the trip',
    example: '22566',
    required: true,
  })
  @IsNumberString()
  @IsNotEmpty()
  tripTrackingNumber: string;
}

export class BusTicketPurchaseDto {
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
    description: 'The invoice details for the ticket purchase.',
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => InvoiceDto)
  invoice?: InvoiceDto;

  @ApiProperty({
    description: 'The trip details for the ticket purchase.',
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => BusTicketPurchaseTripDto)
  trip: BusTicketPurchaseTripDto;

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
    return dayjs(this.trip.travelStartDateTime).format(
      'YYYY-MM-DD',
    ) as DateISODate;
  }

  get time(): DateTime {
    return this.trip.travelStartDateTime as DateTime;
  }

  get passengersWithoutTcNumberExists(): boolean {
    const passengersWithTcNumber = this.passengers.filter(
      (passenger) => !!passenger.tcNumber,
    );
    return passengersWithTcNumber.length !== this.passengers.length;
  }
}
