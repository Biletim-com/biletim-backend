import { Injectable } from '@nestjs/common';

import { PassportsRepository } from './passports.repository';
import { PassengersRepository } from '../passengers.repository';

// errors
import { PassportNotFoundError } from '@app/common/errors';

// types
import { UUID } from '@app/common/types';

@Injectable()
export class PassportsService {
  constructor(
    private readonly passportsRepository: PassportsRepository,
    private readonly passengersRepository: PassengersRepository,
  ) {}

  public async deletePassport(
    ownerUserId: UUID,
    passportId: UUID,
  ): Promise<boolean> {
    const existingPassport = await this.passportsRepository.findOneBy({
      id: passportId,
      passenger: {
        user: {
          id: ownerUserId,
        },
      },
    });
    if (!existingPassport) throw new PassportNotFoundError();

    const result = await this.passportsRepository.delete(passportId);
    return !!result.affected;
  }
}
