import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class PaymentEnvVarsValidation {
  @IsNotEmpty()
  @IsUrl()
  PAYMENT_VPOS_BASE_URI: string;

  @IsNotEmpty()
  @IsUrl()
  PAYMENT_3DSECURE_BASE_URI: string;

  @IsNotEmpty()
  @IsString()
  PAYMENT_MERCHANT_ID: string;

  @IsNotEmpty()
  @IsString()
  PAYMENT_MERCHANT_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  PAYMENT_TERMINAL_NO: string;
}
