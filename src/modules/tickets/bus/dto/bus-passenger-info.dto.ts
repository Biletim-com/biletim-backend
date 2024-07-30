import { BusSeatGender } from '@app/common/enums/bus-seat-gender.enum';
import { isTurkishCitizen } from '@app/common/enums/is-turkish-citizen.enum';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateIf,
} from 'class-validator';

const turkishToEnglish = (text: string): string => {
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
  @IsInt()
  @IsNotEmpty()
  seatNo!: number;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEnum(BusSeatGender)
  @IsNotEmpty()
  gender!: BusSeatGender;

  @IsEnum(isTurkishCitizen)
  @IsOptional()
  isTurkishCitizen!: number;

  @ValidateIf((o) => o.isTurkishCitizen === isTurkishCitizen.CITIZEN)
  @IsNotEmpty({
    message: 'TR ID Number is mandatory for Turkish citizens',
  })
  @IsString()
  @Length(11, 11, {
    message: 'TR ID Number must be 11 characters length',
  })
  turkishIdNumber?;

  @ValidateIf((o) => o.isTurkishCitizen === isTurkishCitizen.FOREIGNER)
  @IsOptional()
  @IsString()
  passportCountryCode?: string;

  @ValidateIf((o) => o.isTurkishCitizen === isTurkishCitizen.FOREIGNER)
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

  constructor(partial: Partial<BusPassengerInfoDto>) {
    Object.assign(this, partial);
    this.isTurkishCitizen = this.isTurkishCitizen ?? 1;
    this.firstName = turkishToEnglish(this.firstName);
    this.lastName = turkishToEnglish(this.lastName);
    const fullName = `${this.firstName}${this.lastName}`;
    if (fullName.length > 20) {
      throw new Error(
        'First name and last name combined must not exceed 20 characters.',
      );
    }
  }
}
