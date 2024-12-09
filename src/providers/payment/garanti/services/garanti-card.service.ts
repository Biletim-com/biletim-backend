import { Injectable } from '@nestjs/common';

import { GarantiHasherService } from '../helpers/garanti-hasher.service';
import { PaymentConfigService } from '@app/configs/payment';

@Injectable()
export class GarantiCardService {
  private readonly garantiHasherService: GarantiHasherService;
  constructor(private readonly paymentConfigService: PaymentConfigService) {}

  public createCustomerCard() {}
}
