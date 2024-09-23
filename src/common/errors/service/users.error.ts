import { ForbiddenResourceError } from './service.error';

export class UserForbiddenError extends ForbiddenResourceError {
  constructor(resource: string) {
    super('User', resource);
  }
}
