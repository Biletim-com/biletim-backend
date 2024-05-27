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
      const user = await this.authService.authenticate(token);
      request['user'] = user;
      if (Date.now() >= decodedToken.exp * 1000) {
        throw new HttpException(
          'Authorization: Token is expired',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const isAdmin = await this.panelUsersService.isPanelUser(user.sub);
      const requireAdmin = this.reflector.get<boolean>(
        'requireAdmin',
        context.getHandler(),
      );
      if (requireAdmin && !isAdmin) {
        throw new HttpException(
          'Forbidden: You do not have permission to access this resource',
          HttpStatus.FORBIDDEN,
        );
      }

      return true;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
