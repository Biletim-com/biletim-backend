import { Injectable, BadRequestException } from '@nestjs/common';

import { GoogleOAuth2Strategy } from '../strategies/google-auth2.strategy';
import { FacebookOAuth2Strategy } from '../strategies/facebook-auth2.strategy';
import { OAuth2Strategy } from '../abstract/oauth2-strategy.abstract';

// types
import { OAuth2Provider } from '@app/common/types';

@Injectable()
export class OAuth2StrategyFactory {
  private readonly strategies: Map<OAuth2Provider, OAuth2Strategy> = new Map();

  constructor(
    googleOAuth2Strategy: GoogleOAuth2Strategy,
    facebookOAuth2Strategy: FacebookOAuth2Strategy,
  ) {
    this.strategies.set('google', googleOAuth2Strategy);
    this.strategies.set('facebook', facebookOAuth2Strategy);
  }

  getStrategy(provider: OAuth2Provider): OAuth2Strategy {
    const strategy = this.strategies.get(provider);
    if (!strategy) {
      throw new BadRequestException('Unsupported OAuth provider');
    }
    return strategy;
  }
}
