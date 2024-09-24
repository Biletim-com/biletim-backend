// import { BadRequestException, Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';

// import { RestClientService } from '@app/providers/rest-client/provider.service';

// import { OAuth2Strategy } from './oauth2-strategy.abstract';

// @Injectable()
// export class FacebookOAuth2Strategy extends OAuth2Strategy {
//   protected TOKEN_URL = 'https://graph.facebook.com/v20.0/oauth/access_token';

//   constructor(
//     private readonly configService: ConfigService,
//     private readonly jwtService: JwtService,
//     private readonly restClientService: RestClientService,
//   ) {
//     super();
//   }

//   protected extractUserCredentialsFromIdToken(idToken: string): {
//     id: string;
//     email?: string;
//   } {
//     const decodedPayload = this.jwtService.decode(idToken);
//     if (!decodedPayload || typeof decodedPayload === 'string')
//       throw new BadRequestException('Invalid idToken');

//     const { sub, email, name } = decodedPayload;

//     if (!sub || !name)
//       throw new BadRequestException('Token does not contain expected fields');

//     return {
//       id: sub,
//       email,
//     };
//   }

//   protected async verifyCode(
//     code: string,
//     redirectUri: string,
//   ): Promise<{ accessToken: string; idToken: string }> {
//     try {
//       const { access_token, id_token } = await this.restClientService.request<{
//         access_token: string;
//         id_token: string;
//       }>({
//         url: this.TOKEN_URL,
//         method: 'GET',
//         params: {
//           client_id: this.configService.get('FACEBOOK_OAUTH_CLIENT_ID'),
//           client_secret: this.configService.get('FACEBOOK_OAUTH_CLIENT_SECRET'),
//           redirect_uri: redirectUri,
//           code,
//         },
//       });
//       return { accessToken: access_token, idToken: id_token };
//     } catch (error) {
//       throw error;
//     }
//   }
// }
