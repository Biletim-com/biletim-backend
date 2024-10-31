import {
  EntityNotFoundError,
  UniqueConstraintViolationError,
} from './service.error';

export class CreditCardNotFoundError extends EntityNotFoundError {
  constructor() {
    super('Credit Card');
  }
}

export class CreditCardUniqueConstraintViolationError extends UniqueConstraintViolationError {
  constructor(fields: string[]) {
    super('Credit Card', fields.join(','));
  }
}
