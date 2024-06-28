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
  IsDate,
  IsEnum,
  Length,
  Max,
  ArrayMaxSize,
  Min,
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

export class AutocompleteDto {
  @ApiProperty({ example: 'hotel' })
  @IsString()
  @IsNotEmpty()
  query!: string;

  @ApiProperty({
    example: 'en',
    enum: [
      'ar',
      'bg',
      'de',
      'el',
      'en',
      'es',
      'fr',
      'it',
      'hu',
      'pl',
      'pt',
      'ro',
      'ru',
      'sr',
      'sq',
      'tr',
    ],
  })
  @IsString()
  @IsOptional()
  @IsEnum([
    'ar',
    'bg',
    'de',
    'el',
    'en',
    'es',
    'fr',
    'it',
    'hu',
    'pl',
    'pt',
    'ro',
    'ru',
    'sr',
    'sq',
    'tr',
  ])
  language?: string;
}

export class searchReservationByRegionIdDto {
  @ApiProperty({
    description: 'Check-in date (Required)',
    example: '2024-07-14',
  })
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  checkin!: Date;

  @ApiProperty({
    description: 'Check-out date (Required)',
    example: '2024-07-16',
  })
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  checkout!: Date;

  @ApiProperty({
    description: "Guest's (or multiple guests') citizenship. (Optional)",
    example: 'us',
  })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  residency?: string;

  @ApiProperty({
    description: 'Language. (Optional)',
    example: 'en',
    enum: [
      'ar',
      'bg',
      'cs',
      'de',
      'el',
      'en',
      'es',
      'fr',
      'he',
      'hu',
      'it',
      'nl',
      'pl',
      'pt',
      'ro',
      'ru',
      'sr',
      'sq',
      'tr',
      'zh_CN',
      'pt_PT',
    ],
  })
  @IsString()
  @IsOptional()
  @IsEnum([
    'ar',
    'bg',
    'cs',
    'de',
    'el',
    'en',
    'es',
    'fr',
    'he',
    'hu',
    'it',
    'nl',
    'pl',
    'pt',
    'ro',
    'ru',
    'sr',
    'sq',
    'tr',
    'zh_CN',
    'pt_PT',
  ])
  language?: string;

  @ApiProperty({
    description: 'List of guests. (Required)',
    type: [GuestDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestDto)
  guests!: GuestDto[];

  @ApiProperty({ description: 'Region ID (required)', example: 536 })
  @IsInt()
  @IsNotEmpty()
  region_id!: number;

  @ApiProperty({ description: 'Currency code (Optional)', example: 'EUR' })
  @IsString()
  @IsOptional()
  currency?: string;
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

export class SearchReservationsHotelsDto {
  @ApiProperty({
    description: 'Check-in date (Required)',
    example: '2024-07-14',
  })
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  checkin!: Date;

  @ApiProperty({
    description: 'Check-out date (Required)',
    example: '2024-07-16',
  })
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  checkout!: Date;

  @ApiProperty({
    description: "Guest's (or multiple guests') citizenship. (Optional)",
    example: 'us',
  })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  residency?: string;

  @ApiProperty({
    description: 'Language. (Optional)',
    example: 'en',
    enum: [
      'ar',
      'bg',
      'cs',
      'de',
      'el',
      'en',
      'es',
      'fr',
      'he',
      'hu',
      'it',
      'nl',
      'pl',
      'pt',
      'ro',
      'ru',
      'sr',
      'sq',
      'tr',
      'zh_CN',
      'pt_PT',
    ],
  })
  @IsString()
  @IsOptional()
  @IsEnum([
    'ar',
    'bg',
    'cs',
    'de',
    'el',
    'en',
    'es',
    'fr',
    'he',
    'hu',
    'it',
    'nl',
    'pl',
    'pt',
    'ro',
    'ru',
    'sr',
    'sq',
    'tr',
    'zh_CN',
    'pt_PT',
  ])
  language?: string;

  @ApiProperty({
    description: 'List of guests. (Required)',
    type: [GuestDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestDto)
  guests!: GuestDto[];

  @ApiProperty({
    description: 'List of hotels ids. (Required). Maximum 300 items.',
    example: [1, 2, 3],
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  @ArrayMaxSize(300)
  @IsInt({ each: true })
  ids: number[];

  @ApiProperty({
    description: "Currency of the rooms' price in the response. (Optional)",
    example: 'TRY',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description:
      'The maximum amount of time (in seconds) within which searched for rates will be returned. (Optional) Max value: 100.',
    example: 30,
  })
  @IsOptional()
  @IsInt()
  @Max(100)
  timeout?: number;
}

export class SearchReservationByHotelDto {
  @ApiProperty({
    description: 'Check-in date (Required)',
    example: '2024-07-14',
  })
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  checkin!: Date;

  @ApiProperty({
    description: 'Check-out date (Required)',
    example: '2024-07-16',
  })
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  checkout!: Date;

  @ApiProperty({
    description: "Guest's (or multiple guests') citizenship. (Optional)",
    example: 'us',
  })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  residency?: string;

  @ApiProperty({
    description: 'Language. (Optional)',
    example: 'en',
    enum: [
      'ar',
      'bg',
      'cs',
      'de',
      'el',
      'en',
      'es',
      'fr',
      'he',
      'hu',
      'it',
      'nl',
      'pl',
      'pt',
      'ro',
      'ru',
      'sr',
      'sq',
      'tr',
      'zh_CN',
      'pt_PT',
    ],
  })
  @IsString()
  @IsOptional()
  @IsEnum([
    'ar',
    'bg',
    'cs',
    'de',
    'el',
    'en',
    'es',
    'fr',
    'he',
    'hu',
    'it',
    'nl',
    'pl',
    'pt',
    'ro',
    'ru',
    'sr',
    'sq',
    'tr',
    'zh_CN',
    'pt_PT',
  ])
  language?: string;

  @ApiProperty({
    description: 'List of guests. (Required)',
    type: [GuestDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestDto)
  guests!: GuestDto[];

  @ApiProperty({
    description: 'Hotel id. (Required)',
    example: 'test_hotel',
  })
  @IsNotEmpty()
  @IsString()
  id!: string;

  @ApiProperty({
    description: "Currency of the rooms' price in the response. (Optional)",
    example: 'TRY',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description:
      'The maximum amount of time (in seconds) within which searched for rates will be returned. (Optional) Max value: 100.',
    example: 30,
  })
  @IsOptional()
  @IsInt()
  @Max(100)
  timeout?: number;
}

export class HotelDetailsDto {
  @ApiProperty({
    description: 'Hotel id (Required)',
    example: 'kolin_hotel',
  })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({
    description: ' Language (Required)',
    example: 'en',
    enum: [
      'ar',
      'bg',
      'cs',
      'de',
      'el',
      'en',
      'es',
      'fr',
      'he',
      'hu',
      'it',
      'nl',
      'pl',
      'pt',
      'ro',
      'ru',
      'sr',
      'sq',
      'tr',
      'zh_CN',
      'pt_PT',
    ],
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum([
    'ar',
    'bg',
    'cs',
    'de',
    'el',
    'en',
    'es',
    'fr',
    'he',
    'hu',
    'it',
    'nl',
    'pl',
    'pt',
    'ro',
    'ru',
    'sr',
    'sq',
    'tr',
    'zh_CN',
    'pt_PT',
  ])
  language!: string;
}

export class PrebookDto {
  @ApiProperty({
    description: 'Unique id of the rate. (Required)',
    example: 'someUniqueHashValue',
  })
  @IsString()
  @Length(1, 256)
  hash!: string;

  @ApiProperty({
    description:
      'The percentage by which the new price can be higher than the original price. (Optional)',
    example: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99)
  price_increase_percent?: number;
}

export class OrderBookingFormDto {
  @ApiProperty({
    description:
      'Id (UUID) of the booking (at the partner) made by the partner (Required)',
    example: 'unique-partner-order-id',
  })
  @IsString()
  @Length(1, 256)
  partner_order_id!: string;

  @ApiProperty({
    description:
      'Unique id of the rate (from the hotel page request) (Required) ',
    example: 'unique-book-hash',
  })
  @IsString()
  @Length(1, 256)
  book_hash!: string;

  @ApiProperty({
    description: 'Language of the reservation. Lower case required. (Required)',
    example: 'en',
  })
  @IsString()
  @Length(2, 2)
  language!: string;
}

class CreditCardDataDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(2)
  year!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(13)
  @MaxLength(19)
  card_number!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  card_holder!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(2)
  month!: string;
}

export class CreditCardDataTokenizationDto {
  @ApiProperty({
    description:
      'Identifier of the booking order item made by the partner (identifier created at Emerging Travel Group) (Required)',
    example: 'unique-object-id',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  object_id!: string;

  @ApiProperty({
    description:
      'Universally unique identifier (UUID4) token of the booking payment check made by the partner (Required)',
    example: 'unique-pay-uuid',
  })
  @IsNotEmpty()
  @IsString()
  @Length(36, 36)
  pay_uuid!: string;

  @ApiProperty({
    description:
      'Universally unique identifier (UUID4) token of the booking payment operation made by the partner (Required)',
    example: 'unique-init-uuid',
  })
  @IsNotEmpty()
  @IsString()
  @Length(36, 36)
  init_uuid!: string;

  @ApiProperty({
    description: 'Guest first name (Required)',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1)
  user_first_name!: string;

  @ApiProperty({
    description: 'Guest last name (Required)',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1)
  user_last_name!: string;

  @ApiProperty({
    description: 'CVC code.(Optional)',
    example: '123',
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  cvc?: string;

  @ApiProperty({
    description: 'Whether or not a CVC code is needed (Required)',
    example: true,
  })
  @IsBoolean()
  is_cvc_required!: boolean;

  @ApiProperty({
    description: 'Credit card data information (Required)',
  })
  @ValidateNested()
  @Type(() => CreditCardDataDto)
  @IsNotEmpty()
  credit_card_data_core!: CreditCardDataDto;
}

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

export class PartnerDto {
  @ApiProperty({
    description:
      'Id (UUID) of the booking (at the partner) made by the partner (Required)',
    example: 'unique-partner-order-id',
  })
  @IsString()
  @Length(1, 256)
  @IsNotEmpty()
  partner_order_id!: string;

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
    description: 'Amount sell B2B2C (Optional)',
    example: 1000,
  })
  @IsOptional()
  @MinLength(1)
  amount_sell_b2b2c?: number;
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

  @ApiProperty({
    description: 'Upsell UID (Optional)',
    example: 'unique-uid',
  })
  @MinLength(1)
  @IsString()
  @IsOptional()
  uid?: string;
}

export class BookingFinishDto {
  @ApiProperty({
    description: 'User information (Required)',
    type: [UserDto],
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmpty()
  user!: UserDto;

  @ApiProperty({
    description: 'Partner information (Required)',
    type: [PartnerDto],
  })
  @ValidateNested()
  @Type(() => PartnerDto)
  @IsNotEmpty()
  partner: PartnerDto;

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
    type: [PaymentTypeDto],
  })
  @ValidateNested()
  @Type(() => PaymentTypeDto)
  @IsNotEmpty()
  payment_type!: PaymentTypeDto;
}

export class WebhookDto {
  data: {
    partner_order_id: string;
    status: string;
  };
  signature: {
    signature: string;
    timestamp: number;
    token: string;
  };
}

export class HotelOrderingDto {
  @ApiProperty({
    description: 'Ordering type (Required)',
    example: 'asc',
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['asc', 'desc'])
  ordering_type!: 'asc' | 'desc';

  @ApiProperty({
    description: 'Field to order by (Required)',
    example: 'created_at',
  })
  @IsNotEmpty()
  @IsString()
  @IsIn([
    'cancelled_at',
    'checkin_at',
    'checkout_at',
    'created_at',
    'free_cancellation_before',
    'payment_due',
    'payment_pending',
  ])
  ordering_by!: string;
}

export class PaginationDto {
  @ApiProperty({
    description: 'Number of items per page (Required)',
    example: 10,
  })
  @IsNotEmpty()
  @Min(1)
  @Max(50)
  @IsInt()
  page_size!: number;

  @ApiProperty({
    description: 'Page number (Required)',
    example: 1,
  })
  @IsNotEmpty()
  @Min(1)
  @IsInt()
  page_number!: number;
}

export class DateTimeRangeDto {
  @ApiProperty({
    description: 'Start date and time (Optional)',
    example: '2024-06-25T10:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  from_date?: string;

  @ApiProperty({
    description: 'End date and time (Optional)',
    example: '2024-06-26T10:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  to_date?: string;
}

export class DateRangeDto {
  @ApiProperty({
    description: 'Start date (Optional)',
    example: '2024-06-25',
  })
  @IsDate()
  @IsOptional()
  from_date?: string;

  @ApiProperty({
    description: 'End date (Optional)',
    example: '2024-06-26',
  })
  @IsDate()
  @IsOptional()
  to_date?: string;
}

export class SearchDto {
  @ApiProperty({
    description: 'Cancellation date range (Optional)',
    type: [DateTimeRangeDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateTimeRangeDto)
  cancelled_at?: DateTimeRangeDto;

  @ApiProperty({
    description: 'Check-in date range (Optional)',
    type: [DateRangeDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  checkin_at?: DateRangeDto;

  @ApiProperty({
    description: 'Check-out date range (Optional)',
    type: [DateRangeDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  checkout_at?: DateRangeDto;

  @ApiProperty({
    description: 'Creation date range (Optional)',
    type: [DateTimeRangeDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateTimeRangeDto)
  created_at?: DateTimeRangeDto;

  @ApiProperty({
    description: 'Free cancellation before date range (Optional)',
    type: [DateTimeRangeDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateTimeRangeDto)
  free_cancellation_before?: DateTimeRangeDto;

  @ApiProperty({
    description: 'Modification date range (Optional)',
    type: [DateTimeRangeDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateTimeRangeDto)
  modified_at?: DateTimeRangeDto;

  @ApiProperty({
    description: 'Order IDs (Optional)',
    type: [Number],
  })
  @IsOptional()
  @Type(() => Number)
  order_ids?: number[];

  @ApiProperty({
    description: 'Paid date range (Optional)',
    type: [DateRangeDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  paid_at?: DateRangeDto;

  @ApiProperty({
    description: 'Partner order IDs (Optional)',
    type: [String],
  })
  @IsOptional()
  @Type(() => String)
  partner_order_ids?: string[];

  @ApiProperty({
    description: 'Payment due date range (Optional)',
    type: [DateRangeDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  payment_due?: DateRangeDto;

  @ApiProperty({
    description: 'Payment pending date range (Optional)',
    type: [DateRangeDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  payment_pending?: DateRangeDto;

  @ApiProperty({
    description: 'Source (Optional)',
    example: 'b2b-api',
  })
  @IsOptional()
  @IsString()
  @IsIn(['b2b-card', 'b2b-site', 'b2b-api', 'b2b-handmade'])
  source?: 'b2b-card' | 'b2b-site' | 'b2b-api' | 'b2b-handmade';

  @ApiProperty({
    description: 'Status (Optional)',
    example: 'completed',
  })
  @IsOptional()
  @IsString()
  @IsIn(['cancelled', 'completed', 'failed', 'noshow', 'rejected'])
  status?: 'cancelled' | 'completed' | 'failed' | 'noshow' | 'rejected';
}

export class OrderTotalInformationDto {
  @ApiProperty({
    description: 'Ordering information (Required)',
    type: HotelOrderingDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => HotelOrderingDto)
  ordering!: HotelOrderingDto;

  @ApiProperty({
    description: 'Pagination information (Required)',
    type: PaginationDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination!: PaginationDto;

  @ApiProperty({
    description: 'Search criteria (Optional)',
    type: [SearchDto],
  })
  @ValidateNested()
  @Type(() => SearchDto)
  @IsOptional()
  search?: SearchDto;

  @ApiProperty({
    description: 'Language code (Optional)',
    example: 'en',
  })
  @IsOptional()
  @IsString()
  @IsIn([
    'ar',
    'bg',
    'cs',
    'de',
    'el',
    'en',
    'es',
    'fr',
    'he',
    'hu',
    'it',
    'nl',
    'pl',
    'pt',
    'ro',
    'ru',
    'sr',
    'sq',
    'tr',
    'zh_CN',
    'pt_PT',
  ])
  language?: string;
}
