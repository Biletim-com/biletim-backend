import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsString,
  IsInt,
  IsArray,
  ValidateNested,
  IsNumberString,
  IsOptional,
  IsNotEmpty,
  ArrayNotEmpty,
  IsIn,
  IsNumber,
  MinLength,
  MaxLength,
  IsUUID,
  IsBoolean,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

class GuestDto {
  @ApiProperty({ description: 'Number of adults', example: 2 })
  @IsInt()
  adults: number;

  @ApiProperty({ description: 'Ages of children', example: [5, 7] })
  @IsArray()
  @IsInt({ each: true })
  children: number[];
}

export class SearchHotelsDto {
  @ApiProperty({ description: 'Check-in date', example: '2024-06-25' })
  @IsDateString()
  checkin: string;

  @ApiProperty({ description: 'Check-out date', example: '2024-06-26' })
  @IsDateString()
  checkout: string;

  @ApiProperty({ description: 'Residency code', example: 'gb' })
  @IsString()
  residency: string;

  @ApiProperty({ description: 'Language code', example: 'en' })
  @IsString()
  language: string;

  @ApiProperty({ description: 'List of guests', type: [GuestDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestDto)
  guests: GuestDto[];

  @ApiProperty({ description: 'Region ID', example: 536 })
  @IsInt()
  region_id: number;

  @ApiProperty({ description: 'Currency code', example: 'EUR' })
  @IsString()
  currency: string;
}

export class HotelPageDto {
  @IsNotEmpty()
  @IsString()
  checkin: string;

  @IsNotEmpty()
  @IsString()
  checkout: string;

  @IsNotEmpty()
  @IsString()
  residency: string;

  @IsNotEmpty()
  @IsString()
  language: string;

  @ApiProperty({ description: 'List of guests', type: [GuestDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestDto)
  guests: GuestDto[];

  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  currency: string;
}

export class ResultHotelsDetailsDto {
  @IsNotEmpty()
  @IsString()
  checkin: string;

  @IsNotEmpty()
  @IsString()
  checkout: string;

  @IsNotEmpty()
  @IsString()
  residency: string;

  @IsNotEmpty()
  @IsString()
  language: string;

  @ApiProperty({ description: 'List of guests', type: [GuestDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestDto)
  guests: GuestDto[];

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids: string[];

  @IsNotEmpty()
  @IsString()
  currency: string;
}

export class QueryDto {
  @IsOptional()
  @IsNumberString({}, { message: 'minPrice must be a number' })
  minPrice?: number;

  @IsOptional()
  @IsNumberString({}, { message: 'maxPrice must be a number' })
  maxPrice?: number;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}

export class PrebookDto {
  @IsString()
  hash: string;

  @IsNumber()
  price_increase_percent: number;
}

export class OrderBookingFormDto {
  @IsString()
  @IsNotEmpty()
  book_hash: string;

  @IsString()
  @IsNotEmpty()
  language: string;
}

export class UserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(256)
  comment?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(35)
  phone: string;
}

export class PartnerDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(256)
  partner_order_id: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(256)
  comment?: string;

  @IsOptional()
  @MinLength(1)
  amount_sell_b2b2c?: number;
}

export class PaymentTypeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @IsIn(['now', 'hotel', 'deposit'])
  type: 'now' | 'hotel' | 'deposit';

  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(3)
  @IsIn([
    'BGN',
    'EUR',
    'GBP',
    'PLN',
    'MYR',
    'RON',
    'RUB',
    'SGD',
    'TRY',
    'USD',
    'ZAR',
  ])
  currency_code:
    | 'BGN'
    | 'EUR'
    | 'GBP'
    | 'PLN'
    | 'MYR'
    | 'RON'
    | 'RUB'
    | 'SGD'
    | 'TRY'
    | 'USD'
    | 'ZAR';

  @IsString()
  @IsOptional()
  @IsUUID()
  init_uuid?: string;

  @IsString()
  @IsOptional()
  @IsUUID()
  pay_uuid?: string;
}

export class GuestsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(32)
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(32)
  last_name: string;

  @IsOptional()
  @IsBoolean()
  is_child?: boolean;

  @IsOptional()
  @IsInt()
  age?: number;
}

export class RoomDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestsDto)
  @IsNotEmpty()
  guests: GuestsDto[];
}

export class UpsellDataDto {
  @MinLength(1)
  @IsString()
  @IsOptional()
  @IsIn(['early_checkin', 'late_checkout'])
  name?: 'early_checkin' | 'late_checkout';

  @MinLength(1)
  @IsString()
  @IsOptional()
  uid?: string;
}

export class BookingFinishDto {
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmpty()
  user: UserDto;

  @ValidateNested()
  @Type(() => PartnerDto)
  @IsNotEmpty()
  partner: PartnerDto;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(2)
  language: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoomDto)
  @IsNotEmpty()
  rooms: RoomDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpsellDataDto)
  upsell_data?: UpsellDataDto[];

  @MinLength(1)
  @MaxLength(256)
  @IsString()
  @IsOptional()
  return_path?: string;

  @ValidateNested()
  @Type(() => PaymentTypeDto)
  @IsNotEmpty()
  payment_type: PaymentTypeDto;
}

class CreditCardDataDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(2)
  year: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(13)
  @MaxLength(19)
  card_number: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  card_holder: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(2)
  month: string;
}

export class CreditCardDataTokenizationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  object_id: string;

  pay_uuid?: string;

  init_uuid?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  user_first_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  user_last_name: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  cvc?: string;

  @IsBoolean()
  @IsNotEmpty()
  is_cvc_required: boolean;

  @ValidateNested()
  @Type(() => CreditCardDataDto)
  @IsNotEmpty()
  credit_card_data_core: CreditCardDataDto;
}
