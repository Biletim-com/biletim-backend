import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RestClientService } from '@app/providers/rest-client/provider.service';

import { OAuth2Strategy } from '../abstract/oauth2-strategy.abstract';
import { OAuthLoginWithGoogleConfigService } from '@app/configs/oauth-google';

@Injectable()
export class GoogleOAuth2Strategy extends OAuth2Strategy {
  protected TOKEN_URL = 'https://oauth2.googleapis.com/token';
  private readonly restClientService: RestClientService;

  constructor(
    private readonly jwtService: JwtService,
    private readonly oAuthLoginWithGoogleConfigService: OAuthLoginWithGoogleConfigService,
  ) {
    super();
    this.restClientService = new RestClientService(this.TOKEN_URL);
  }

  protected extractUserCredentialsFromIdToken(idToken: string): {
    id: string;
    email?: string;
    name: string;
    familyName: string;
  } {
    const decodedPayload = this.jwtService.decode(idToken);
    if (!decodedPayload || typeof decodedPayload === 'string')
      throw new BadRequestException('Invalid idToken');

    const { sub, email, name, family_name } = decodedPayload;

    if (!sub || !name)
      throw new BadRequestException('Token does not contain expected fields');

    return {
      id: sub,
      email,
      name,
      familyName: family_name,
    };
  }

  protected async verifyCode(
    code: string,
    redirectUri: string,
  ): Promise<{ accessToken: string; idToken: string }> {
    try {
      const { access_token, id_token } = await this.restClientService.request<{
        access_token: string;
        id_token: string;
      }>({
        method: 'POST',
        url: this.TOKEN_URL,
        data: {
          client_id: this.oAuthLoginWithGoogleConfigService.clientId,
          client_secret: this.oAuthLoginWithGoogleConfigService.clientSecret,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code,
        },
      });
      return {
        accessToken: access_token,
        idToken: id_token,
      };
    } catch (error) {
      throw error;
    }
  }
}
