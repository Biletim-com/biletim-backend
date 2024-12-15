import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  ValidateNested,
  IsEnum,
  IsDateString,
  IsArray,
  ArrayMinSize,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

import { BankCardDto, InvoiceDto } from '@app/common/dtos';
import { DateISODate } from '@app/common/types';
import { Gender } from '@app/common/enums';

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

export class HotelBookingPurchaseDto {
  @ApiProperty({
    description: 'Contact email address of the person booking the ticket',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      'Contact phone number of the person booking the ticket. Must be 10 characters',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Unique id of the rate. (Required)',
    example: 'h-364cce9c-91ff-58d4-aaad-df3f6a659465',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  bookHash: string;

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

  @ApiProperty({
    description: 'Bank card info',
    type: BankCardDto,
    required: true,
  })
  @ValidateNested()
  @Type(() => BankCardDto)
  bankCard: BankCardDto;
}
