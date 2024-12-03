import { Min, Max, IsNumber, IsString } from 'class-validator';

export class MongoEnvVarsValidation {
  @IsString()
  MONGO_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  MONGO_PORT: number;

  @IsString()
  MONGO_DB: string;

  @IsString()
  MONGO_USER: string;

  @IsString()
  MONGO_PASSWORD: string;
}
