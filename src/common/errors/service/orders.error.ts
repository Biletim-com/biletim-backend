import { EntityNotFoundError, ServiceError } from './service.error';

export class OrderNotFoundError extends EntityNotFoundError {
  constructor() {
    super('Order');
  }
}

export class OrderReturnDeadlineExpiredError extends ServiceError {
  constructor() {
    super('Order return deadline has been expired!');
  }
}

export class OrderCannotBeReturnedError extends ServiceError {
  constructor(orderStatus: string) {
    super(`Order cannot be cancelled. Current order status: ${orderStatus}`);
  }
}
