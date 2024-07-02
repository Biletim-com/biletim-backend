import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
import { jwtDecode } from 'jwt-decode';
import { PanelUsersService } from '../panel-users/panel-users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly panelUsersService: PanelUsersService,
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const header = request.headers.authorization;
    if (!header) {
      throw new HttpException(
        'Authorization: Bearer <token> header missing',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const parts = header.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new HttpException(
        'Authorization: Bearer <token> header invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const token = parts[1];
      const decodedToken: any = jwtDecode(token);
      const userAgent = request.headers['user-agent'];
      console.log(`User-Agent: ${userAgent}`);
      console.log(request.headers['refresh-token']);
      console.log(request.headers);
      let newAccessToken: any;
      if (Date.now() >= decodedToken.exp * 1000) {
        const refreshToken = request.headers['refresh-token'];

        if (!refreshToken) {
          throw new HttpException(
            'Authorization: Token is expired and no refresh token available',
            HttpStatus.UNAUTHORIZED,
          );
        }

        const decodedRefreshToken: any = jwtDecode(refreshToken);
        const isRefreshTokenExpired =
          Date.now() >= decodedRefreshToken.exp * 1000;

        if (isRefreshTokenExpired) {
          throw new HttpException(
            'Authorization: Refresh token is expired',
            HttpStatus.UNAUTHORIZED,
          );
        }

        const findedUserWithRefreshToken =
          await this.authService.findAndValidateUserByRefreshToken(
            refreshToken,
          );

        if (!findedUserWithRefreshToken) {
          throw new HttpException(
            'Authorization: Refresh token is invalid or expired',
            HttpStatus.UNAUTHORIZED,
          );
        }

        newAccessToken = this.authService.createAccessToken(
          findedUserWithRefreshToken,
        );

        request.headers.authorization = `Bearer ${newAccessToken}`;
      }
      const user = newAccessToken
        ? await this.authService.authenticate(newAccessToken)
        : await this.authService.authenticate(token);
      request['user'] = user;

      const isAdmin = await this.panelUsersService.isPanelUser(user.sub);
      const requireAdmin = this.reflector.get<boolean>(
        'requireAdmin',
        context.getHandler(),
      );
      if (requireAdmin && !isAdmin) {
        throw new HttpException(
          ' You do not have permission to access this resource',
          HttpStatus.FORBIDDEN,
        );
      }

      return true;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
