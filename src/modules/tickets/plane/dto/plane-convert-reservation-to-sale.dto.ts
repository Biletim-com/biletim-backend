import {
  IsArray,
  IsEnum,
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

export class PlanePassengerInfoConvertReservationDto {
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
  @Transform(({ value }) => {
    const genderStr = value.toString().toLowerCase().trim();

    if (genderStr === 'male') return Gender.MALE;
    if (genderStr === 'female') return Gender.FEMALE;

    return undefined;
  })
  gender: Gender;

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

  @IsOptional()
  @IsString()
  passportNumber?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  passportExpiryDate?: string;

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
export class WebPassengerFlightConvertReservationToSaleDto {
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
  reservationPnrCode?: string;
}

export class FlightConvertReservationToSaleRequestDto {
  @IsNotEmpty()
  @IsString()
  companyNo: string;

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
  @Type(() => PlanePassengerInfoConvertReservationDto)
  passengers: PlanePassengerInfoConvertReservationDto[];

  @ValidateNested({ each: true })
  @Type(() => InvoiceDto)
  invoice: InvoiceDto;

  @ValidateNested({ each: true })
  @Type(() => WebPassengerFlightConvertReservationToSaleDto)
  webPassenger: WebPassengerFlightConvertReservationToSaleDto;
}
