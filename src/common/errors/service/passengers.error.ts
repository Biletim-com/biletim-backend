import { EntityNotFoundError, ForbiddenResourceError } from './service.error';

export class PassengerNotFoundError extends EntityNotFoundError {
  constructor() {
    super('Passenger');
  }
}

export class PassengerForbiddenResourceError extends ForbiddenResourceError {
  constructor(source: string) {
    super('Passenger', source);
  }
}
