import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

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
    private readonly dataSource: DataSource,
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
  ): Promise<Omit<Passenger, 'user'>> {
    const existingUser = await this.usersRepository.findEntityData(
      userOrUserId,
    );

    const passengerToCreate = new Passenger({
      user: existingUser,
      ...passengerDataToCreate,
      ...(passports
        ? { passports: passports.map((passport) => new Passport(passport)) }
        : { passports: [] }),
    });
    await this.passengersRepository.save(passengerToCreate);
    const { user: _user, ...passengerToReturn } = passengerToCreate;
    return passengerToReturn;
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

    // compose passport data
    const passportsToCreate: Passport[] = [];
    const passportsToUpdate: Passport[] = [];
    passports?.forEach((passport) => {
      if (passport.id) {
        passportsToUpdate.push(
          new Passport({
            ...passport,
            passenger: new Passenger({ id: passengerId }),
          }),
        );
      } else {
        passportsToCreate.push(
          new Passport({
            ...passport,
            passenger: new Passenger({ id: passengerId }),
          }),
        );
      }
    });

    // validate passport via id
    const passportIdsToUpdate =
      passportsToUpdate?.map((passport) => passport.id) || [];
    const passengerPassportIds = existingPassenger.passports.map(
      (passport) => passport.id,
    );
    passportIdsToUpdate.forEach((passportIdToUpdate) => {
      if (!passengerPassportIds.includes(passportIdToUpdate)) {
        throw new PassengerForbiddenResourceError(
          `passport id with ${passportIdToUpdate}`,
        );
      }
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // update passenger
      await queryRunner.manager.update(
        Passenger,
        passengerId,
        updatePassengerDto,
      );
      await queryRunner.manager.save(passportsToUpdate);
      await queryRunner.manager.save(passportsToCreate);

      await queryRunner.commitTransaction();
      return {
        ...existingPassenger,
        ...updatePassengerDto,
        passports: Array.from(
          new Set([
            ...existingPassenger.passports,
            ...passportsToCreate,
            ...passportsToUpdate,
          ]),
        ),
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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
