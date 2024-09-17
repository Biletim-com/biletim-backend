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

export class InvoiceDto {
  @IsInEnumKeys(PlaneInvoiceType, {
    message: 'Invoice type must be valid key (PEOPLE or COMPANY)',
  })
  @IsNotEmpty()
  invoiceType: PlaneInvoiceType;

  @IsOptional()
  @IsString()
  individualFirstName?: string;

  @IsOptional()
  @IsString()
  individualLastName?: string;

  @IsOptional()
  @IsString()
  individualTurkishIdNumber?: string;

  @IsOptional()
  @IsString()
  individualAddress?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  companyTaxNumber?: string;

  @IsOptional()
  @IsString()
  companyTaxOffice?: string;

  @IsOptional()
  @IsString()
  companyAddress?: string;
}

export class WebPassengerFlightPurchaseDto {
  @IsNotEmpty()
  @IsString()
  ip: string;

  @IsString()
  @IsOptional()
  creditCardNumber?: string;

  @IsString()
  @IsOptional()
  creditCardHolderName?: string;

  @IsString({ message: 'Credit card expiration date (month.year) format' })
  @Matches(/^(0?[1-9]|1[0-2])\.(\d{4})$/)
  creditCardExpiryDate?: string;

  @IsOptional()
  @IsString()
  @Length(3, 3, { message: 'creditCardCCV2 must be 3 digits' })
  creditCardCCV2: string;

  @IsString()
  @IsOptional()
  openTicketPnrCode?: string;

  @IsString()
  @IsOptional()
  openTicketSurname?: string;

  @IsString()
  @IsOptional()
  openTicketAmount?: string;

  @IsString()
  @IsOptional()
  reservationPnrCode?: string;
}

export class FlightTicketPurchaseRequestDto {
  @IsNotEmpty()
  @IsString()
  companyNo: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 10, {
    message: 'phone Number must be 10 characters length',
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 10, {
    message: 'Mobile Phone Number must be 10 characters length',
  })
  mobilePhoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
  )
  email?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlightSegmentDto)
  segments: FlightSegmentDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanePassengerInfoDto)
  passengers: PlanePassengerInfoDto[];

  @ValidateNested({ each: true })
  @Type(() => InvoiceDto)
  invoice: InvoiceDto;

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
