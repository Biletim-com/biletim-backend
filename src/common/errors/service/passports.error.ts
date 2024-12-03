import { EntityNotFoundError } from './service.error';

export class PassportNotFoundError extends EntityNotFoundError {
  constructor() {
    super('Passport');
  }
}
