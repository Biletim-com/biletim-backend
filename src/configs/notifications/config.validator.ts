import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class NotificationsEnvVarsValidation {
  @IsNotEmpty()
  @IsString()
  EMAIL_HOST: string;

  @IsNotEmpty()
  @IsNumber()
  EMAIL_PORT: number;

  @IsNotEmpty()
  @IsString()
  EMAIL_USERNAME: string;

  @IsNotEmpty()
  @IsString()
  EMAIL_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  EMAIL_USE_SSL: string;

  @IsNotEmpty()
  @IsString()
  EMAIL_FROM: string;
}
