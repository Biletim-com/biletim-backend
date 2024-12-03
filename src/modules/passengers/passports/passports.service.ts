import { Injectable } from '@nestjs/common';

import { Passport } from './passport.entity';

import { PassportsRepository } from './passports.repository';
import { PassengersRepository } from '../passengers.repository';

// dtos
import { UpdatePassportDto } from './dto/update-passport.dto';
import { AddPassportBodyDto } from './dto/add-passport.dto';

// errors
import {
  PassengerNotFoundError,
  PassportNotFoundError,
} from '@app/common/errors';

// types
import { UUID } from '@app/common/types';

@Injectable()
export class PassportsService {
  constructor(
    private readonly passportsRepository: PassportsRepository,
    private readonly passengersRepository: PassengersRepository,
  ) {}

  public async addPassportToPassenger(
    ownerUserId: UUID,
    passengerId: UUID,
    passport: AddPassportBodyDto,
  ): Promise<Passport> {
    const existingPassenger = await this.passengersRepository.findOneBy({
      id: passengerId,
      user: { id: ownerUserId },
    });
    if (!existingPassenger) throw new PassengerNotFoundError();

    const passportDataToCreate = new Passport({
      ...passport,
      passenger: existingPassenger,
    });

    return this.passportsRepository.save(passportDataToCreate);
  }

  public async updatePassport(
    ownerUserId: UUID,
    passportId: UUID,
    updatePassportDto: UpdatePassportDto,
  ): Promise<Passport> {
    const existingPassport = await this.passportsRepository.findOneBy({
      id: passportId,
      passenger: {
        user: {
          id: ownerUserId,
        },
      },
    });
    if (!existingPassport) throw new PassportNotFoundError();

    const newPassengerData = new Passport(updatePassportDto);
    await this.passportsRepository.update(passportId, newPassengerData);
    return { ...existingPassport, ...newPassengerData };
  }

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
