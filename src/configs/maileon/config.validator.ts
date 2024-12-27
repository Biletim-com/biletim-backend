import { IsString, IsNotEmpty } from 'class-validator';

export class MaileonEnvVarsValidation {
  @IsString()
  @IsNotEmpty()
  MAILEON_BASE_URL: string;

  @IsString()
  @IsNotEmpty()
  MAILEON_API_KEY: string;
}
