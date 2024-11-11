import { ForbiddenResourceError, EntityNotFoundError } from './service.error';

export class UserNotFoundError extends EntityNotFoundError {
  constructor() {
    super('User');
  }
}

export class UserForbiddenError extends ForbiddenResourceError {
  constructor(resource: string) {
    super('User', resource);
  }
}
