import { UUID } from '@app/common/types';

export class VakifBankCustomerHelperService {
  public static generateVPosCustomerId(id: UUID): string {
    return id.replace('-', '').substring(0, 15);
  }
}
