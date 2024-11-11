import { Injectable } from '@nestjs/common';

import { WalletsRepository } from './wallets.repository';

@Injectable()
export class WalletsService {
  constructor(private readonly walletsRespository: WalletsRepository) {}
}
