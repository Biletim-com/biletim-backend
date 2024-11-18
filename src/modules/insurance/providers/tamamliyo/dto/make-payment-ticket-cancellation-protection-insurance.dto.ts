import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsNotEmpty,
  IsInt,
} from 'class-validator';

export class MakePaymentParametersTicketCancellationProtectionInsuranceDto {
  @IsString()
  pnrNo: string;

  @IsOptional()
  @IsString()
  flightNumber?: string;

  @IsString()
  ticketNumber: string;
}

export class MakePaymentTicketCancellationProtectionInsuranceRequestDto {
  @ValidateNested()
  @Type(() => MakePaymentParametersTicketCancellationProtectionInsuranceDto)
  @IsNotEmpty()
  parameters: MakePaymentParametersTicketCancellationProtectionInsuranceDto;

  @IsNumber()
  offerId: string;

  @IsInt()
  installmentCount: number;

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

  @IsOptional()
  @IsInt()
  countryId?: number;

  @IsString()
  address: string;
}

export class MakePaymentTicketCancellationProtectionInsuranceRequestDtoInTurkish {
  parameters: {
    pnrNo: string;
    flightNumber?: string;
    ticketNumber: string;
  };
  odemeTipi: string;
  teklifId: string;
  taksitSayisi: number;
  krediKartiCvv: string;
  krediKartiNo: string;
  krediKartiBitisTarihi: string;
  krediKartiAd: string;
  krediKartiSoyad: string;
  ulkeKodu?: number;
  adres: string;
}
