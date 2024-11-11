import { ServiceError } from './service.error';

export class PaymentProviderUnsupported extends ServiceError {
  constructor(provider: string) {
    super(`Unsupported payment provider: ${provider}`);
  }
}
