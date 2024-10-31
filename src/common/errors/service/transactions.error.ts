import { EntityNotFoundError } from './service.error';

export class TransactionNotFoundError extends EntityNotFoundError {
  constructor() {
    super('Transaction');
  }
}
