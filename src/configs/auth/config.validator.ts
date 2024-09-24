import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
  IsInt,
} from 'class-validator';

export class AuthEnvVarsValidation {
  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsInt()
  @IsNotEmpty()
  JWT_EXPIRATION?: number;

  @IsNumber()
  @IsOptional()
  BCRYPT_SALT_ROUNDS?: number;

  @IsUrl()
  @IsNotEmpty()
  RESET_PASSWORD_URL: string;
}
