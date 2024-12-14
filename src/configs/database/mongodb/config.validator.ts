import { IsString } from 'class-validator';

export class MongoEnvVarsValidation {
  @IsString()
  MONGO_HOST: string;

  @IsString()
  MONGO_PORT: string;

  @IsString()
  MONGO_DB: string;

  @IsString()
  MONGO_USER: string;

  @IsString()
  MONGO_PASSWORD: string;
}
