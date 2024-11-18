import {
  EntityNotFoundError,
  UniqueConstraintViolationError,
} from './service.error';

export class BankCardNotFoundError extends EntityNotFoundError {
  constructor() {
    super('Credit Card');
  }
}

export class BankCardUniqueConstraintViolationError extends UniqueConstraintViolationError {
  constructor(fields: string[]) {
    super('Credit Card', fields.join(','));
  }
}
