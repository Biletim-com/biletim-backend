import {
  Injectable,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';

import { AuthConfigService } from '@app/configs/auth';
import { UsersRepository } from '@app/modules/users/users.repository';

// types
import { AccessTokenPayload } from '@app/auth/types/token-payload.type';
import type { Request } from 'express';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(
    private jwt: JwtService,
    private authConfigService: AuthConfigService,
    private usersRepository: UsersRepository,
  ) {}

  private getToken = ExtractJwt.fromExtractors([
    (request: Request) => request?.cookies?.Authentication?.accessToken,
  ]);

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    // user may defined by a guard if it's used, so skip this interceptor
    if (req.user) {
      return next.handle();
    }
    const token = this.getToken(req) || '';
    try {
      const payload: AccessTokenPayload = this.jwt.verify(token, {
        secret: this.authConfigService.jwtSecret,
      });
      if (payload && payload.type && payload.type == 'access') {
        const user = await this.usersRepository.findOneBy({
          id: payload.sub,
        });
        req.user = user;
      }
    } catch (error) {
      // token not valid
    }

    return next.handle();
  }
}
