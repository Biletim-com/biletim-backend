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
import { FlightSegmentDto } from './plane-pull-price-flight.dto';
import { turkishToEnglish } from '../../bus/dto/bus-passenger-info.dto';
import { DateISODate } from '@app/common/types';
import * as dayjs from 'dayjs';
import { FlightTicketReservationResult } from '../services/biletall/types/biletall-plane-ticket-reservation.type';
import { Gender } from '@app/common/enums/bus-seat-gender.enum';
import { PassengerType } from '@app/common/enums/passanger-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class PlanePassengerInfoDto {
  @ApiProperty({
    description: 'The first name of the passenger.',
    example: 'John',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => turkishToEnglish(value))
  firstName: string;

  @ApiProperty({
    description: 'The last name of the passenger.',
    example: 'Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => turkishToEnglish(value))
  lastName: string;

  @ApiProperty({
    description:
      'The gender of the passenger. Valid values are "male" or "female".',
    example: 'MALE',
    required: true,
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  @Transform(({ value }) => {
    const genderStr = value.toString().toLowerCase().trim();

    if (genderStr === 'male') return Gender.MALE;
    if (genderStr === 'female') return Gender.FEMALE;

    return undefined;
  })
  gender: Gender;

  @ApiProperty({
    description:
      'The type of the passenger. Valid values include "adult", "child", "baby", "senior", "student", "disabled", "soldier", and "youth".',

    example: 'ADULT',
    required: true,
  })
  @IsEnum(PassengerType)
  @IsNotEmpty()
  @Transform(({ value }) => {
    const passengerTypeStr = value.toString().toLowerCase().trim();

    switch (passengerTypeStr) {
      case 'adult':
        return PassengerType.ADULT;
      case 'child':
        return PassengerType.CHILD;
      case 'baby':
        return PassengerType.BABY;
      case 'senior':
        return PassengerType.SENIOR;
      case 'student':
        return PassengerType.STUDENT;
      case 'disabled':
        return PassengerType.DISABLED;
      case 'soldier':
        return PassengerType.SOLDIER;
      case 'youth':
        return PassengerType.YOUTH;
      default:
        return undefined;
    }
  })
  passengerType: PassengerType;

  @ApiProperty({
    description: 'The birth date of the passenger in yyyy-MM-dd format.',
    example: '2000-01-01',
    required: true,
  })
  @IsDateString({}, { message: 'Date must be in the format yyyy-MM-dd' })
  @IsNotEmpty()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD'))
  birthday?: DateISODate;

  @ApiProperty({
    description: 'The passport number of the passenger.',
    example: 'A12345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  passportNumber?: string;

  @ApiProperty({
    description: 'The expiry date of the passport in yyyy-MM-dd format.',
    example: '2025-12-31',
    required: false,
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  passportExpiryDate?: string;

  @ApiProperty({
    description:
      'The Turkish ID number of the passenger. Must be 11 characters length.',
    example: '12345678901',
    required: false,
  })
  @IsString()
  @Length(11, 11, {
    message: 'TR ID Number must be 11 characters length',
  })
  turkishIdNumber?: string;

  @ApiProperty({
    description: 'The net price of the ticket for the passenger.',
    example: '100.00',
    required: false,
  })
  @IsOptional()
  @IsString()
  netPrice: string;

  @ApiProperty({
    description: 'The tax amount applicable to the passenger’s ticket.',
    example: '10.00',
    required: false,
  })
  @IsOptional()
  @IsString()
  tax: string;

  @ApiProperty({
    description: 'The service fee for the passenger’s ticket.',
    example: '5.00',
    required: false,
  })
  @IsOptional()
  @IsString()
  serviceFee: string;
}

export class FlightReservationRequestDto {
  @ApiProperty({
    description: 'The company number associated with the reservation.',
    example: '1100',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  companyNo: string;

  @ApiProperty({
    description:
      'The phone number of the person making the reservation. Must be 10 characters length.',
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
      'The mobile phone number of the person making the reservation. Must be 10 characters length.',
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
    description: 'The email address of the person making the reservation.',
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
    description: 'The list of flight segments for the reservation.',
    type: [FlightSegmentDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlightSegmentDto)
  segments: FlightSegmentDto[];

  @ApiProperty({
    description: 'The list of passengers for the reservation.',
    type: [PlanePassengerInfoDto],
  })
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
