import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// types
import { DateTime, UUID } from '@app/common/types';

// dtos
import { CreditCardDto } from './credit-card.dto';
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
    example: 'c4fe88bd-0137-452c-9eb3-157b9475d56c',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  departureTerminalId: UUID;

  @ApiProperty({
    description: 'Arrival point ID for the bus trip',
    example: 'c0e2a626-8e1d-4688-8c04-d93aef9b8961',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  arrivalTerminalId: UUID;

  @ApiProperty({
    description: 'Date of the trip in the format YYYY-MM-ddTHH:mm.SS',
    example: '2024-09-20T15:00.00',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  travelStartDateTime: DateTime;

  @ApiProperty({
    description: 'Route number for the bus trip',
    example: 1,
    required: true,
  })
  @IsInt()
  @IsNotEmpty()
  routeNumber: number;

  @ApiProperty({
    description: 'Tracking number for the trip',
    example: '20470',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tripTrackingNumber: string;

  @ApiProperty({
    description: 'Total price of the tickets',
    example: 150,
    required: true,
  })
  @IsPositive()
  @IsNotEmpty()
  totalTicketPrice: number;

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
    description: 'Credit card info',
    type: CreditCardDto,
    required: true,
  })
  @ValidateNested()
  @Type(() => CreditCardDto)
  creditCard: CreditCardDto;
}
