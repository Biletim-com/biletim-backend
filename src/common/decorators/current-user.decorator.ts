import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UUID } from '../types';

export interface TCurrentUser {
  id: UUID;
  sub: string;
  name: string;
  familyName: string;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
