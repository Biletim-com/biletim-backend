import { EntityNotFoundError, ServiceError } from './service.error';

export class OrderNotFoundError extends EntityNotFoundError {
  constructor() {
    super('Order');
  }
}

export class OrderAlreadyReturnedError extends ServiceError {
  constructor() {
    super('Order has already been refunded!');
  }
}
