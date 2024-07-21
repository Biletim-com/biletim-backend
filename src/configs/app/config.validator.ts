import {
  Min,
  Max,
  IsNumber,
  IsEnum,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { Environment } from './config.types';

export class AppEnvVarsValidation {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  APP_PORT: number;

  @IsString()
  @IsNotEmpty()
  BILETALL_WSDL_URI: string;

  @IsString()
  @IsNotEmpty()
  BILETALL_WS_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  BILETALL_WS_PASSWORD: string;
}
