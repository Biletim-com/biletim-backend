import { Min, Max, IsNumber, IsEnum } from 'class-validator';
import { Environment } from './config.types';

export class AppEnvVarsValidation {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  APP_PORT: number;
}
