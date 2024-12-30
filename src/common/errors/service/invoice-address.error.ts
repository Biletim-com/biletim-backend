import { EntityNotFoundError } from './service.error';

export class InvoiceAddressNotFoundError extends EntityNotFoundError {
  constructor() {
    super('InvoiceAddress');
  }
}
