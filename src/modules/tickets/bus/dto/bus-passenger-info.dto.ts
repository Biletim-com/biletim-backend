import { Gender } from '@app/common/enums/bus-seat-gender.enum';
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
  @IsString()
  @IsNotEmpty()
  seatNo: number;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => turkishToEnglish(value))
  firstName: string;

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

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsBoolean()
  @IsOptional()
  isTurkishCitizen?: boolean;

  @ValidateIf((o) => o.isTurkishCitizen === true)
  @IsNotEmpty({
    message: 'TR ID Number is mandatory for Turkish citizens',
  })
  @IsString()
  @Length(11, 11, {
    message: 'TR ID Number must be 11 characters length',
  })
  turkishIdNumber?: string;

  @ValidateIf((o) => o.isTurkishCitizen === false)
  @IsOptional()
  @IsString()
  passportCountryCode?: string;

  @ValidateIf((o) => o.isTurkishCitizen === false)
  @IsOptional()
  @IsString()
  passportNumber?: string;

  @IsString()
  @MaxLength(15)
  @IsOptional()
  boardingLocation?: string;

  @IsString()
  @MaxLength(15)
  @IsOptional()
  departureServiceLocation?: string;

  @IsString()
  @MaxLength(15)
  @IsOptional()
  arrivalServiceLocation?: string;
}
