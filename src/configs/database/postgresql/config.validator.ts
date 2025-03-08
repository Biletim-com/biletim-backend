import { Min, Max, IsNumber, IsString, IsBooleanString } from 'class-validator';

export class PostgreSQLEnvVarsValidation {
  @IsString()
  POSTGRES_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  POSTGRES_PORT: number;

  @IsString()
  POSTGRES_DB: string;

  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsBooleanString()
  POSTGRES_USE_SSL: 'true' | 'false';
}
