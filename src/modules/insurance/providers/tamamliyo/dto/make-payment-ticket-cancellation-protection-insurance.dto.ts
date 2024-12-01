import { Type } from 'class-transformer';
import { IsString, IsOptional, ValidateNested } from 'class-validator';

export class MakePaymentParametersTicketCancellationProtectionInsuranceDto {
  @IsOptional()
  @IsString()
  pnrNo?: string;

  @IsOptional()
  @IsString()
  flightNumber?: string;

  @IsOptional()
  @IsString()
  ticketNumber?: string;
}

export class MakePaymentTicketCancellationProtectionInsuranceRequestDto {
  @ValidateNested()
  @Type(() => MakePaymentParametersTicketCancellationProtectionInsuranceDto)
  parameters: MakePaymentParametersTicketCancellationProtectionInsuranceDto;

  @IsString()
  offerId: string;

  @IsString()
  creditCardCvv: string;

  @IsString()
  creditCardNumber: string;

  @IsString()
  creditCardExpiryDate: string; // Expiry date of the credit card "2023-04-01"

  @IsString()
  creditCardHolderName: string;

  @IsString()
  creditCardHolderSurname: string;
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
  ilId: number;
  ilceId: string;
  adres: string;
}
