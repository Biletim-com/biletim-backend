import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderBookingFinishStatusRequestDto } from './hotel-order-booking-finish-status.dto';

export class UserDto {
  @ApiProperty({
    description: 'User email (Required)',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email!: string;

  @ApiProperty({
    description: 'Comment (Optional)',
    example: 'This is a comment',
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(256)
  comment?: string;

  @ApiProperty({
    description: 'User phone (Required)',
    example: '+123456789',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(35)
  phone!: string;
}

export class PaymentTypeDto {
  @ApiProperty({
    description: 'Payment type (Required)',
    example: 'now',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @IsIn(['now', 'hotel', 'deposit'])
  type!: 'now' | 'hotel' | 'deposit';

  @ApiProperty({
    description: 'Payment amount (Required)',
    example: 1000,
  })
  @IsNotEmpty()
  amount!: number;

  @ApiProperty({
    description: 'Currency code (Required)',
    example: 'USD',
  })
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
  currency_code!:
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

  @ApiProperty({
    description: 'Initialization UUID (Optional)',
    example: 'unique-init-uuid',
  })
  @IsString()
  @IsOptional()
  @IsUUID()
  init_uuid?: string;

  @ApiProperty({
    description: 'Payment UUID (Optional)',
    example: 'unique-pay-uuid',
  })
  @IsString()
  @IsOptional()
  @IsUUID()
  pay_uuid?: string;
}

export class GuestsDto {
  @ApiProperty({
    description: 'Guest first name (Required)',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(32)
  first_name!: string;

  @ApiProperty({
    description: 'Guest last name (Required)',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(32)
  last_name!: string;

  @ApiProperty({
    description: 'Is child (Optional)',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_child?: boolean;

  @ApiProperty({
    description: 'Guest age (Optional)',
    example: 7,
  })
  @IsOptional()
  @IsInt()
  age?: number;
}

export class RoomDto {
  @ApiProperty({
    description: 'List of guests (Required)',
    type: [GuestsDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestsDto)
  @IsNotEmpty()
  guests!: GuestsDto[];
}

export class UpsellDataDto {
  @ApiProperty({
    description: 'Upsell name (Optional)',
    example: 'early_checkin',
  })
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

export class BookingFinishRequestDto {
  @ApiProperty({
    description: 'User information (Required)',
    type: UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmpty()
  user!: UserDto;

  @ApiProperty({
    description: 'Partner information (Required)',
    type: OrderBookingFinishStatusRequestDto,
  })
  @ValidateNested()
  @Type(() => OrderBookingFinishStatusRequestDto)
  @IsNotEmpty()
  partner!: OrderBookingFinishStatusRequestDto;

  @ApiProperty({
    description: 'Language code (Required)',
    example: 'en',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(2)
  language!: string;

  @ApiProperty({
    description: 'List of rooms (Required)',
    type: [RoomDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoomDto)
  @IsNotEmpty()
  rooms!: RoomDto[];

  @ApiProperty({
    description: 'Upsell data (Optional)',
    type: [UpsellDataDto],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpsellDataDto)
  upsell_data?: UpsellDataDto[];

  @ApiProperty({
    description: 'Return path (Optional)',
    example: 'https://example.com/return',
  })
  @MinLength(1)
  @MaxLength(256)
  @IsString()
  @IsOptional()
  return_path?: string;

  @ApiProperty({
    description: 'Payment type (Required)',
    type: PaymentTypeDto,
  })
  @ValidateNested()
  @Type(() => PaymentTypeDto)
  @IsNotEmpty()
  payment_type!: PaymentTypeDto;
}
