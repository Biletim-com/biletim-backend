import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class AuthEnvVarsValidation {
  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsNumber()
  @IsOptional()
  BCRYPT_SALT_ROUNDS?: number;

  @IsUrl()
  @IsNotEmpty()
  RESET_PASSWORD_URL: string;
}
