import { IsString, IsNotEmpty } from 'class-validator';

export class QueueEnvVarsValidation {
  @IsString()
  @IsNotEmpty()
  REDIS_HOST: string;

  @IsString()
  @IsNotEmpty()
  REDIS_PORT: string;

  @IsString()
  @IsNotEmpty()
  REDIS_PASSWORD: string;
}
