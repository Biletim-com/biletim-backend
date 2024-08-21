import {
  IsString,
  IsOptional,
  Matches,
  ValidateNested,
  IsArray,
  IsNotEmpty,
  IsEnum,
  Length,
  IsDateString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PlaneTicketOperationType } from '@app/common/enums/plane-ticket-operation-type.enum';
import { FlightSegmentDto } from './plane-pull-price-flight.dto';
import { turkishToEnglish } from '../../bus/dto/bus-passenger-info.dto';
import { Gender, PassengerType } from '@app/common/enums';
import { DateISODate } from '@app/common/types';
import * as dayjs from 'dayjs';
import { FlightTicketReservationResult } from '../services/biletall/types/biletall-plane-ticket-reservation.type';

export class PlanePassengerInfoDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => turkishToEnglish(value))
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => turkishToEnglish(value))
  lastName: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsEnum(PassengerType)
  @IsNotEmpty()
  passengerType: PassengerType;

  @IsDateString({}, { message: 'Date must be in the format yyyy-MM-dd' })
  @IsNotEmpty()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD'))
  birthday?: DateISODate;

  @IsOptional()
  @IsString()
  passportNumber?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  passportExpiryDate?: string; // PasaportGecerlilikTarihi

  @IsString()
  @Length(11, 11, {
    message: 'TR ID Number must be 11 characters length',
  })
  turkishIdNumber?: string;

  @IsOptional()
  @IsString()
  netPrice: string;

  @IsOptional()
  @IsString()
  tax: string;

  @IsOptional()
  @IsString()
  serviceFee: string;
}

export class FlightReservationRequestDto {
  @IsNotEmpty()
  @IsEnum(PlaneTicketOperationType)
  operationType: PlaneTicketOperationType;

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
}

export class FlightTicketReservationDto {
  result: string[];
  PNR: string[];
  ReservationValidityTime: string[];
  constructor(ticketReservation: FlightTicketReservationResult) {
    (this.result = ticketReservation.Sonuc),
      (this.PNR = ticketReservation.PNR),
      (this.ReservationValidityTime = ticketReservation.RezervasyonOpsiyon);
  }
}
