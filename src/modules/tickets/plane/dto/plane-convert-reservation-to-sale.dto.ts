import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { FlightSegmentDto } from './plane-pull-price-flight.dto';
import { PassengerType } from '@app/common/enums/passanger-type.enum';
import { turkishToEnglish } from '../../bus/dto/bus-passenger-info.dto';
import { Transform, Type } from 'class-transformer';
import { Gender } from '@app/common/enums/bus-seat-gender.enum';
import { InvoiceDto } from './plane-ticket-purchase.dto';
import { IsInEnumKeys } from '@app/common/decorators';

export class PlanePassengerInfoConvertReservationDto {
  @ApiProperty({
    description: 'First name of the passenger.',
    example: 'John',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => turkishToEnglish(value))
  firstName: string;

  @ApiProperty({
    description: 'Last name of the passenger.',
    example: 'Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => turkishToEnglish(value))
  lastName: string;

  @IsInEnumKeys(Gender, {
    message: 'Gender must be a valid key (FEMALE or MALE)',
  })
  @IsNotEmpty()
  gender: Gender;

  @IsInEnumKeys(PassengerType, {
    message:
      'Passenger type must be valid key (ADULT , CHILD , BABY , SENIOR , STUDENT , DISABLED , SOLDIER, YOUTH  )',
  })
  @IsNotEmpty()
  passengerType: PassengerType;

  @ApiProperty({
    description: 'Passport number of the passenger (if applicable).',
    example: 'X1234567',
    required: false,
  })
  @IsOptional()
  @IsString()
  passportNumber?: string;

  @ApiProperty({
    description: 'Passport expiry date in YYYY-MM-DD format (if applicable).',
    example: '2025-12-31',
    required: false,
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  passportExpiryDate?: string;

  @ApiProperty({
    description: 'Turkish ID Number, must be 11 characters in length.',
    example: '12345678901',
    required: false,
  })
  @IsString()
  @Length(11, 11, {
    message: 'TR ID Number must be 11 characters length',
  })
  turkishIdNumber?: string;

  @ApiProperty({
    description: 'Net price of the ticket (if applicable).',
    example: '100.00',
    required: false,
  })
  @IsOptional()
  @IsString()
  netPrice: string;

  @ApiProperty({
    description: 'Tax amount of the ticket (if applicable).',
    example: '18.00',
    required: false,
  })
  @IsOptional()
  @IsString()
  tax: string;

  @ApiProperty({
    description: 'Service fee for the ticket (if applicable).',
    example: '5.00',
    required: false,
  })
  @IsOptional()
  @IsString()
  serviceFee: string;
}
export class WebPassengerFlightConvertReservationToSaleDto {
  @ApiProperty({
    description: 'IP address of the user making the reservation.',
    example: '127.0.0.1',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  ip: string;

  @ApiProperty({
    description: 'Credit card number for payment.',
    example: '4111111111111111',
    required: false,
  })
  @IsString()
  @IsOptional()
  creditCardNumber?: string;

  @ApiProperty({
    description: 'Name of the credit card holder.',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  creditCardHolderName?: string;

  @ApiProperty({
    description:
      'Credit card expiration date in the format month.year (e.g., 05.2024).',
    example: '05.2024',
    required: false,
  })
  @IsString({ message: 'Credit card expiration date (month.year) format' })
  @Matches(/^(0?[1-9]|1[0-2])\.(\d{4})$/)
  creditCardExpiryDate?: string;

  @ApiProperty({
    description: 'CCV2 of the credit card, must be 3 digits.',
    example: '123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 3, { message: 'creditCardCCV2 must be 3 digits' })
  creditCardCCV2: string;

  @ApiProperty({
    description: 'Reservation PNR code if available.',
    example: 'DEF456',
    required: false,
  })
  @IsString()
  @IsOptional()
  reservationPnrCode?: string;
}

export class FlightConvertReservationToSaleRequestDto {
  @ApiProperty({
    description: 'Company number for the transaction.',
    example: '1000',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  companyNo: string;

  @ApiProperty({
    description:
      'Mobile phone number of the user, must be 10 characters in length.',
    example: '5551234567',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 10, {
    message: 'Mobile Phone Number must be 10 characters length',
  })
  mobilePhoneNumber: string;

  @ApiProperty({
    description: 'Email address of the user.',
    example: 'emre.yilmaz@westerops.com',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
  )
  email?: string;

  @ApiProperty({
    description: 'List of flight segments for the transaction.',
    type: [FlightSegmentDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlightSegmentDto)
  segments: FlightSegmentDto[];

  @ApiProperty({
    description: 'List of passengers for the transaction.',
    type: [PlanePassengerInfoConvertReservationDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanePassengerInfoConvertReservationDto)
  passengers: PlanePassengerInfoConvertReservationDto[];

  @ApiProperty({
    description: 'Invoice details for the transaction.',
    type: InvoiceDto,
  })
  @ValidateNested({ each: true })
  @Type(() => InvoiceDto)
  invoice: InvoiceDto;

  @ApiProperty({
    description:
      'Web passenger information for converting reservation to sale.',
    type: WebPassengerFlightConvertReservationToSaleDto,
  })
  @ValidateNested({ each: true })
  @Type(() => WebPassengerFlightConvertReservationToSaleDto)
  webPassenger: WebPassengerFlightConvertReservationToSaleDto;
}
