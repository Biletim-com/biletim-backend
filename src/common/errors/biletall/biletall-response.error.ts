import { ServiceError } from '../service/service.error';

export class BiletAllResponseError extends ServiceError {
  constructor(message?: string) {
    super(message || 'BiletAll Error occurred');
  }
}
