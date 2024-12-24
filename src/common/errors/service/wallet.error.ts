import { ServiceError, EntityNotFoundError } from './service.error';

export class WalletNotFoundError extends EntityNotFoundError {
  constructor() {
    super('Wallet');
  }
}

export class InsufficientWalletBalanceError extends ServiceError {
  constructor() {
    super('Wallat has insufficient balance');
  }
}
