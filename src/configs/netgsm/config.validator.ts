import { IsString, IsNotEmpty } from 'class-validator';

export class NetGsmEnvVarsValidation {
  @IsString()
  @IsNotEmpty()
  NETGSM_BASE_URL: string;

  @IsString()
  @IsNotEmpty()
  NETGSM_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  NETGSM_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  NETGSM_APP_KEY: string;
}
