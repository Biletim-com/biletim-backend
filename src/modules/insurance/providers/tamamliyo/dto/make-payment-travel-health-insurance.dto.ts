import { InsuranceTicketType } from '@app/common/enums';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsNotEmpty,
  IsInt,
} from 'class-validator';

export class MakePaymentParametersTravelHealthInsuranceDto {
  @IsEnum(InsuranceTicketType)
  ticketType: InsuranceTicketType;

  @IsString()
  pnrNo: string;

  @IsOptional()
  @IsString()
  flightNumber?: string;

  @IsString()
  company: string;

  @IsString()
  departureLocation: string;

  @IsString()
  arrivalLocation: string;

  @IsString()
  departureDateTime: string; // Departure date and time ("2023-12-14 18:00:00")
}

export class MakePaymentTravelHealthInsuranceRequestDto {
  @ValidateNested()
  @Type(() => MakePaymentParametersTravelHealthInsuranceDto)
  @IsNotEmpty()
  parameters: MakePaymentParametersTravelHealthInsuranceDto;

  @IsNumber()
  offerId: string;

  @IsString()
  creditCardCvv: string;

  @IsString()
  creditCardNumber: string;

  @IsString()
  creditCardExpiryDate: string; // Expiry date of the credit card "2023-04-01"

  @IsString()
  creditCardHolderFirstName: string;

  @IsString()
  creditCardHolderLastName: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsInt()
  countryId: number;
}

export class MakePaymentTravelHealthInsuranceRequestDtoInTurkish {
  parameters: {
    ticketType: string;
    pnrNo: string;
    flightNumber?: string;
    company: string;
    departureLocation: string;
    arrivalLocation: string;
    departureDateTime: string;
  };
  odemeTipi: string;
  teklifId: string;
  krediKartiCvv: string;
  krediKartiNo: string;
  krediKartiBitisTarihi: string;
  krediKartiAd: string;
  krediKartiSoyad: string;
  ulkeKodu?: number;
  adres: string;
  donusUrl: null;
}
