import { ServiceError } from './service.error';

export class VerificaitonCodeInvalidError extends ServiceError {
  constructor() {
    super('Invalid Verificaiton Code');
  }
}

export class VerificaitonCodeExpiredError extends ServiceError {
  constructor() {
    super('Verificaiton Code is Expired');
  }
}

export class VerificaitonCodeUserError extends ServiceError {
  constructor() {
    super('Verificaiton Code has already been used');
  }
}
