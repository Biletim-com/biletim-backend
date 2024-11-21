import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsNotEmpty,
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

  @IsString()
  creditCardCvv: string;

  @IsString()
  creditCardNumber: string;

  @IsString()
  creditCardExpiryDate: string; // Expiry date of the credit card "2023-04"

  @IsString()
  creditCardHolder: string;
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
  kartNo: string;
  kartSonKullanmaTarihi: string;
  kartSahibi: string;
  ilId: number;
  ilceId: string;
  adres: string;
}
