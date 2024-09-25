import { IsString } from 'class-validator';

export class OAuthLoginWithGoogleEnvVarsValidation {
  @IsString()
  GOOGLE_OAUTH_CLIENT_ID: string;

  @IsString()
  GOOGLE_OAUTH_CLIENT_SECRET: string;
}
