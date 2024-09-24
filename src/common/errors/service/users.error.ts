import { ForbiddenResourceError, NotFoundError } from './service.error';

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super('User');
  }
}

export class UserForbiddenError extends ForbiddenResourceError {
  constructor(resource: string) {
    super('User', resource);
  }
}
