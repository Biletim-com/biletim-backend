import { Gender } from '@app/common/enums/bus-seat-gender.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export const turkishToEnglish = (text: string): string => {
  const turkishMap: { [key: string]: string } = {
    Ç: 'C',
    Ğ: 'G',
    İ: 'I',
    Ö: 'O',
    Ş: 'S',
    Ü: 'U',
    ç: 'c',
    ğ: 'g',
    ı: 'i',
    ö: 'o',
    ş: 's',
    ü: 'u',
  };
  return text
    .split('')
    .map((char) => turkishMap[char] || char)
    .join('');
};

export class BusPassengerInfoDto {
  @ApiProperty({
    description: 'Seat number assigned to the passenger.',
    example: '2',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  seatNo: number;

  @ApiProperty({
    description: 'First name of the passenger.',
    example: 'John',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => turkishToEnglish(value))
  firstName: string;

  @ApiProperty({
    description: 'Last name of the passenger.',
    example: 'Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => turkishToEnglish(value))
  lastName: string;

  @ValidateIf((o) => o.firstName && o.lastName)
  @Length(0, 20, {
    message:
      'The full name (combination of firstName and lastName) is longer than 20.',
  })
  get fullName() {
    return `${this.firstName}${this.lastName}`;
  }

  @ApiProperty({
    description: 'Gender of the passenger: male or female.',
    example: 'male',
    enum: Gender,
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
    description: 'Indicates whether the passenger is a Turkish citizen.',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isTurkishCitizen?: boolean;

  @ApiProperty({
    description:
      'TR ID Number of the passenger, mandatory for Turkish citizens.',
    example: '12345678901',
    required: false,
  })
  @ValidateIf((o) => o.isTurkishCitizen === true)
  @IsNotEmpty({
    message: 'TR ID Number is mandatory for Turkish citizens',
  })
  @IsString()
  @Length(11, 11, {
    message: 'TR ID Number must be 11 characters length',
  })
  turkishIdNumber?: string;

  @ApiProperty({
    description:
      'Passport country code, mandatory if the passenger is not a Turkish citizen.',
    example: 'US',
    required: false,
  })
  @ValidateIf((o) => o.isTurkishCitizen === false)
  @IsOptional()
  @IsString()
  passportCountryCode?: string;

  @ApiProperty({
    description:
      'Passport number, mandatory if the passenger is not a Turkish citizen.',
    example: 'A12345678',
    required: false,
  })
  @ValidateIf((o) => o.isTurkishCitizen === false)
  @IsOptional()
  @IsString()
  passportNumber?: string;

  @ApiProperty({
    description: 'Boarding location of the passenger.',
    example: 'Istanbul Terminal',
    required: false,
  })
  @IsString()
  @MaxLength(15)
  @IsOptional()
  boardingLocation?: string;

  @ApiProperty({
    description: 'Service location for departure.',
    example: 'Service Point A',
    required: false,
  })
  @IsString()
  @MaxLength(15)
  @IsOptional()
  departureServiceLocation?: string;

  @ApiProperty({
    description: 'Service location for arrival.',
    example: 'Service Point B',
    required: false,
  })
  @IsString()
  @MaxLength(15)
  @IsOptional()
  arrivalServiceLocation?: string;
}
