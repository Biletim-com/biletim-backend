import { Type } from 'class-transformer';
import { FlightSegmentDto } from './plane-pull-price-flight.dto';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { PlanePassengerInfoDto } from './plane-ticket-reservation.dto';
import { PlaneInvoiceType } from '@app/common/enums/plane-invoice-type.enum';
import { FlightTicketPurchaseResult } from '../services/biletall/types/biletall-plane-ticket-purchase.type';
import { IsInEnumKeys } from '@app/common/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class InvoiceDto {
  @ApiProperty({
    description: 'Invoice type (PEOPLE or COMPANY)',
    example: 'PEOPLE',
    required: true,
  })
  @IsInEnumKeys(PlaneInvoiceType, {
    message: 'Invoice type must be valid key (PEOPLE or COMPANY)',
  })
  @IsNotEmpty()
  invoiceType: PlaneInvoiceType;

  @ApiProperty({
    description:
      'First name of the individual for the invoice (if applicable).',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  individualFirstName?: string;

  @ApiProperty({
    description: 'Last name of the individual for the invoice (if applicable).',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  individualLastName?: string;

  @ApiProperty({
    description:
      'Turkish ID number of the individual for the invoice (if applicable).',
    example: '12345678901',
    required: false,
  })
  @IsOptional()
  @IsString()
  individualTurkishIdNumber?: string;

  @ApiProperty({
    description: 'Address of the individual for the invoice (if applicable).',
    example: '123 Main Street, Istanbul',
    required: false,
  })
  @IsOptional()
  @IsString()
  individualAddress?: string;

  @ApiProperty({
    description: 'Name of the company for the invoice (if applicable).',
    example: 'Westerops',
    required: false,
  })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({
    description: 'Tax number of the company for the invoice (if applicable).',
    example: '1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  companyTaxNumber?: string;

  @ApiProperty({
    description: 'Tax office of the company for the invoice (if applicable).',
    example: 'Ankara Tax Office',
    required: false,
  })
  @IsOptional()
  @IsString()
  companyTaxOffice?: string;

  @ApiProperty({
    description: 'Address of the company for the invoice (if applicable).',
    example: '456 Business Park, Ankara',
    required: false,
  })
  @IsOptional()
  @IsString()
  companyAddress?: string;
}

export class WebPassengerFlightPurchaseDto {
  @ApiProperty({
    description: 'IP address of the web passenger making the flight purchase.',
    example: '127.0.0.1',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  ip: string;

  @ApiProperty({
    description: 'Credit card number of the passenger.',
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
    description: 'Open ticket PNR code if available.',
    example: 'ABC123',
    required: false,
  })
  @IsString()
  @IsOptional()
  openTicketPnrCode?: string;

  @ApiProperty({
    description: 'Surname for open ticket if available.',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  openTicketSurname?: string;

  @ApiProperty({
    description: 'Open ticket amount if applicable.',
    example: '100.00',
    required: false,
  })
  @IsString()
  @IsOptional()
  openTicketAmount?: string;

  @ApiProperty({
    description: 'Reservation PNR code if available.',
    example: 'DEF456',
    required: false,
  })
  @IsString()
  @IsOptional()
  reservationPnrCode?: string;
}

export class FlightTicketPurchaseRequestDto {
  @ApiProperty({
    description: 'The company number.',
    example: '1000',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  companyNo: string;

  @ApiProperty({
    description:
      'The phone number of the person purchasing the ticket. Must be 10 characters length.',
    example: '1234567890',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 10, {
    message: 'phone Number must be 10 characters length',
  })
  phoneNumber: string;

  @ApiProperty({
    description:
      'The mobile phone number of the person purchasing the ticket. Must be 10 characters length.',
    example: '0987654321',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 10, {
    message: 'Mobile Phone Number must be 10 characters length',
  })
  mobilePhoneNumber: string;

  @ApiProperty({
    description: 'The email address of the person purchasing the ticket.',
    example: 'emre.yilmaz@westerops.com',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
  )
  email: string;

  @ApiProperty({
    description: 'The list of flight segments for the ticket purchase.',
    type: [FlightSegmentDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlightSegmentDto)
  segments: FlightSegmentDto[];

  @ApiProperty({
    description: 'The list of passengers for the ticket purchase.',
    type: [PlanePassengerInfoDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanePassengerInfoDto)
  passengers: PlanePassengerInfoDto[];

  @ApiProperty({
    description: 'The invoice details for the ticket purchase.',
    type: InvoiceDto,
  })
  @ValidateNested({ each: true })
  @Type(() => InvoiceDto)
  invoice: InvoiceDto;

  @ApiProperty({
    description: 'Web passenger details for flight purchase.',
    type: WebPassengerFlightPurchaseDto,
  })
  @ValidateNested({ each: true })
  @Type(() => WebPassengerFlightPurchaseDto)
  webPassenger: WebPassengerFlightPurchaseDto;
}

export class FlightTicketPurchaseDto {
  result: string[];
  PNR: string[];
  ticket: { [key: string]: string[] } | undefined;

  constructor(ticketPurchase: FlightTicketPurchaseResult) {
    this.result = ticketPurchase.Sonuc;
    this.PNR = ticketPurchase.PNR;
    this.ticket = ticketPurchase.EBilet;
  }
}
