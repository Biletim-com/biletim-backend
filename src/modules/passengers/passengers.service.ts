import { Injectable } from '@nestjs/common';

import { User } from '../users/user.entity';
import { Passport } from './passports/passport.entity';
import { Passenger } from './passenger.entity';

import { UsersRepository } from '../users/users.repository';
import { PassengersRepository } from './passengers.repository';

// dtos
import { CreatePassengerDto } from './dtos/create-passenger.dto';
import { UpdatePassengerDto } from './dtos/update-passenger.dto';

// errors
import {
  PassengerForbiddenResourceError,
  PassengerNotFoundError,
} from '@app/common/errors';

// types
import { UUID } from '@app/common/types';

@Injectable()
export class PassengersService {
  constructor(
    private readonly passengersRepository: PassengersRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  public async listPassengersByUserId(userId: UUID): Promise<Passenger[]> {
    return this.passengersRepository.find({
      where: { user: { id: userId } },
      relations: { passports: true },
    });
  }

  public async addPassengerToUser(
    userOrUserId: UUID | User,
    { passports, ...passengerDataToCreate }: CreatePassengerDto,
  ): Promise<Passenger> {
    const user = await this.usersRepository.findEntityData(userOrUserId);

    const passengerToCreate = new Passenger({
      user,
      ...passengerDataToCreate,
      ...(passports
        ? { passports: passports.map((passport) => new Passport(passport)) }
        : { passports: [] }),
    });
    return this.passengersRepository.save(passengerToCreate);
  }

  public async updatePassenger(
    ownerUserId: UUID,
    passengerId: UUID,
    { passports, ...updatePassengerDto }: UpdatePassengerDto,
  ): Promise<Passenger> {
    const existingPassenger = await this.passengersRepository.findOne({
      where: {
        id: passengerId,
        user: { id: ownerUserId },
      },
      relations: {
        passports: true,
      },
    });
    if (!existingPassenger) throw new PassengerNotFoundError();

    const passportIdsToUpdate = passports?.map((passport) => passport.id) || [];
    const passengerPassportIds = existingPassenger.passports.map(
      (passport) => passport.id,
    );
    passportIdsToUpdate.forEach((passportIdToUpdate) => {
      if (
        passportIdToUpdate &&
        passengerPassportIds.includes(passportIdToUpdate)
      ) {
        throw new PassengerForbiddenResourceError(
          `passport id with ${passportIdToUpdate}`,
        );
      }
    });

    return this.passengersRepository.save(updatePassengerDto);
  }

  public async deletePassenger(
    ownerUserId: UUID,
    passengerId: UUID,
  ): Promise<boolean> {
    const existingPassenger = await this.passengersRepository.findOneBy({
      id: passengerId,
      user: { id: ownerUserId },
    });
    if (!existingPassenger) throw new PassengerNotFoundError();

    const result = await this.passengersRepository.delete(passengerId);
    return !!result.affected;
  }
}
