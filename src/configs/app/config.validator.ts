import { Min, Max, IsNumber, IsEnum } from 'class-validator';
import { AppEnvironment } from '@app/common/enums';

export class AppEnvVarsValidation {
  @IsEnum(AppEnvironment)
  NODE_ENV: AppEnvironment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  APP_PORT: number;
}
