import { ServiceError } from '../service.error';

export class BiletAllResponseError extends ServiceError {
  constructor(message?: string) {
    super(message || 'BiletAll Error occurred');
  }
}
