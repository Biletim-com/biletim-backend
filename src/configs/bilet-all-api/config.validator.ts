import { IsString, IsNotEmpty } from 'class-validator';

export class BiletAllApiEnvVarsValidation {
  @IsString()
  @IsNotEmpty()
  BILETALL_BASE_URI: string;

  @IsString()
  @IsNotEmpty()
  BILETALL_3DSECURE_BASE_URI: string;

  @IsString()
  @IsNotEmpty()
  BILETALL_WS_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  BILETALL_WS_PASSWORD: string;
}
