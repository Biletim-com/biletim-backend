import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  ValidateNested,
  IsEnum,
  IsDateString,
  IsArray,
  ArrayMinSize,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

import { DateISODate, DateTime } from '@app/common/types';
import { Gender } from '@app/common/enums';
import { IsAfter } from '@app/common/decorators';
import { InvoiceDto } from './invoice.dto';
import { PurchaseDto } from './purchase.dto';

const hotelNameRegex =
  "^[^Wd_]+([^Wd_]*[\u0590-\u05FF\u0900-\u097F\u0980-\u09FF\u0E00-\u0E7F'-,.’s]*)*$";

class HotelRoomGuestDto {
  @ApiProperty({
    description: 'The first name of the passenger.',
    example: 'John',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(hotelNameRegex)
  firstName: string;

  @ApiProperty({
    description: 'The last name of the passenger.',
    example: 'Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(hotelNameRegex)
  lastName: string;

  @ApiProperty({
    description: 'Gender of the passenger.',
    required: true,
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({
    description: 'The birth date of the passenger in yyyy-MM-dd format.',
    example: '2000-01-01',
    required: true,
  })
  @IsNotEmpty()
  @IsDateString()
  @MaxLength(10, { message: 'Only provide the date part: YYYY-MM-DD' })
  birthday: DateISODate;
}

export class HotelBookingPurchaseDto extends PurchaseDto {
  @ApiProperty({
    description: 'Unique id of the rate',
    example: 'h-364cce9c-91ff-58d4-aaad-df3f6a659465',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  bookHash: string;

  @ApiProperty({
    description: 'Date and Time of the trip in the format YYYY-MM-ddTHH:mm:SS',
    example: '2024-09-20T15:00:00',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  checkinDateTime: DateTime;

  @ApiProperty({
    description: 'Date and Time of the trip in the format YYYY-MM-ddTHH:mm:SS',
    example: '2024-09-20T15:00:00',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  @IsAfter('checkinDateTime')
  checkoutDateTime: DateTime;

  @ApiProperty({
    description: 'The list of guests for a single room',
    type: [HotelRoomGuestDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => HotelRoomGuestDto)
  guests: HotelRoomGuestDto[];

  @ApiProperty({
    description: 'The invoice details for the ticket purchase.',
    required: true,
  })
  @ValidateNested({ each: true })
  @Type(() => InvoiceDto)
  invoice: InvoiceDto;
}
