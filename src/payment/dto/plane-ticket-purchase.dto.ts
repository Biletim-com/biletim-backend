import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// enums
import { PassengerType } from '@app/common/enums';

// dtos
import { FlightSegmentDto } from '@app/common/dtos';
import { PassengerInfoDto } from './passenger-info.dto';
import { InvoiceDto } from './invoice.dto';

// decoratos
import { IsValidPlanePassengerType } from '@app/common/decorators';
import { PurchaseDto } from './purchase.dto';
import { DateISODate } from '@app/common/types';

export class PlanePassengerInfoDto extends PassengerInfoDto {
  constructor(passengerInfo: PlanePassengerInfoDto) {
    super();
    Object.assign(this, passengerInfo);
  }

  // this is for validating passenger type based on companies' age rule
  // IsValidPlanePassengerType decorator does the validation
  @IsNotEmpty()
  @IsString()
  private readonly companyNumber: string;

  @ApiProperty({
    description: 'The birth date of the passenger in yyyy-MM-dd format.',
    example: '2000-01-01',
    required: true,
  })
  @IsNotEmpty()
  @IsDateString()
  @MaxLength(10, { message: 'Only provide the date part: YYYY-MM-DD' })
  birthday: DateISODate;

  @ApiProperty({
    description: 'The type of the passenger.',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(PassengerType)
  @IsValidPlanePassengerType()
  passengerType: PassengerType;

  @ApiProperty({
    description: 'The net price of the ticket for the passenger.',
    example: '100.00',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  netPrice: string;

  @ApiProperty({
    description: 'The tax amount applicable to the passenger’s ticket.',
    example: '10.00',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  taxAmount: string;

  @ApiProperty({
    description: 'The service fee for the passenger’s ticket.',
    example: '5.00',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  serviceFee: string;
}

export class PlaneTicketPurchaseDto extends PurchaseDto {
  @ApiProperty({
    description: 'The company number.',
    example: '1000',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  companyNumber: string;

  @ApiProperty({
    description: 'The invoice details for the ticket purchase.',
    required: true,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => InvoiceDto)
  invoice: InvoiceDto;

  @ApiProperty({
    description: 'The list of passengers for the ticket purchase.',
    type: [PlanePassengerInfoDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanePassengerInfoDto)
  @Transform(({ value, obj }) =>
    value.map(
      (passanger) =>
        new PlanePassengerInfoDto({
          ...passanger,
          companyNumber: obj.companyNumber,
        }),
    ),
  )
  passengers: PlanePassengerInfoDto[];

  @ApiProperty({
    description: 'The list of flight segments.',
    type: [FlightSegmentDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlightSegmentDto)
  segments: FlightSegmentDto[];
}
