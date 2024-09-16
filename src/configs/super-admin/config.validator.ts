import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class SuperAdminEnvVarsValidation {
  @IsEmail()
  @IsNotEmpty()
  SUPER_ADMIN_EMAIL: string;

  @IsString()
  @IsNotEmpty()
  SUPER_ADMIN_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  SUPER_ADMIN_KEY: string;
}
