import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RestClientService } from '@app/providers/rest-client/provider.service';

import { OAuth2Strategy } from '../abstract/oauth2-strategy.abstract';
import { OAuthLoginWithFacebookConfigService } from '@app/configs/oauth-facebook';

@Injectable()
export class FacebookOAuth2Strategy extends OAuth2Strategy {
  protected TOKEN_URL = 'https://graph.facebook.com/v20.0/oauth/access_token';
  private readonly restClientService: RestClientService;

  constructor(
    private readonly jwtService: JwtService,
    private readonly oAuthLoginWithFacebookConfigService: OAuthLoginWithFacebookConfigService,
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

    const { sub, email, name, familyName } = decodedPayload;

    if (!sub || !name)
      throw new BadRequestException('Token does not contain expected fields');

    return {
      id: sub,
      email,
      name,
      familyName,
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
        method: 'GET',
        url: this.TOKEN_URL,
        params: {
          client_id: this.oAuthLoginWithFacebookConfigService.clientId,
          client_secret: this.oAuthLoginWithFacebookConfigService.clientSecret,
          redirect_uri: redirectUri,
          code,
        },
      });
      return { accessToken: access_token, idToken: id_token };
    } catch (error) {
      throw error;
    }
  }
}
