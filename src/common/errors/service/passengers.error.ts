import { EntityNotFoundError } from './service.error';

export class PassengerNotFoundError extends EntityNotFoundError {
  constructor() {
    super('Passenger');
  }
}
