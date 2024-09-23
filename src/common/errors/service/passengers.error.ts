import { NotFoundError } from './service.error';

export class PassengerNotFoundError extends NotFoundError {
  constructor() {
    super('Passenger');
  }
}
