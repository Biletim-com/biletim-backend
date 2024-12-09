import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class PaymentEnvVarsValidation {
  @IsNotEmpty()
  @IsUrl()
  VAKIF_BANK_VPOS_BASE_URI: string;

  @IsNotEmpty()
  @IsUrl()
  VAKIF_BANK_3DS_BASE_URI: string;

  @IsNotEmpty()
  @IsString()
  VAKIF_BANK_MERCHANT_ID: string;

  @IsNotEmpty()
  @IsString()
  VAKIF_BANK_MERCHANT_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  VAKIF_BANK_TERMINAL_NO: string;

  @IsNotEmpty()
  @IsString()
  BILETALL_3DS_BASE_URI: string;
}
