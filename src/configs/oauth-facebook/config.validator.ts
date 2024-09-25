import { IsString } from 'class-validator';

export class OAuthLoginWithFacebookEnvVarsValidation {
  @IsString()
  FACEBOOK_OAUTH_CLIENT_ID: string;

  @IsString()
  FACEBOOK_OAUTH_CLIENT_SECRET: string;
}
