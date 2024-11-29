import { IsString, IsNotEmpty } from 'class-validator';

export class ChromiumEnvVarsValidation {
  @IsString()
  @IsNotEmpty()
  CHOROMIUM_HOST: string;

  @IsString()
  @IsNotEmpty()
  CHOROMIUM_PORT: string;
}
