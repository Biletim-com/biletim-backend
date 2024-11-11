import { Injectable } from '@nestjs/common';

import { User } from '../users/user.entity';
import { UsersRepository } from '../users/users.repository';

import { Passenger } from './passenger.entity';
import { PassengersRepository } from './passengers.repository';

// dtos
import { CreatePassengerDto } from './dtos/create-passenger.dto';
import { UpdatePassengerDto } from './dtos/update-passenger.dto';

// errors
import { PassengerNotFoundError } from '@app/common/errors';

// types
import { UUID } from '@app/common/types';
import { Passport } from './passports/passport.entity';

@Injectable()
export class PassengersService {
  constructor(
    private readonly passengersRepository: PassengersRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  public async listPassengersByUserId(userId: UUID): Promise<Passenger[]> {
    return this.passengersRepository.find({
      where: { user: { id: userId } },
      relations: { passport: true },
    });
  }

  public async addPassengerToUser(
    userOrUserId: UUID | User,
    { passport, ...passengerDataToCreate }: CreatePassengerDto,
  ): Promise<Passenger> {
    const user = await this.usersRepository.findEntityData(userOrUserId);

    const passengerToCreate = new Passenger({
      user,
      ...passengerDataToCreate,
      ...(passport ? { passport: new Passport(passport) } : { passport: null }),
    });
    return this.passengersRepository.save(passengerToCreate);
  }

  public async updatePassenger(
    ownerUserId: UUID,
    passengerId: UUID,
    updatePassengerDto: UpdatePassengerDto,
  ): Promise<Passenger> {
    const existingPassenger = await this.passengersRepository.findOneBy({
      id: passengerId,
      user: { id: ownerUserId },
    });
    if (!existingPassenger) throw new PassengerNotFoundError();

    const newPassengerData = new Passenger(updatePassengerDto);
    await this.passengersRepository.update(passengerId, newPassengerData);
    return { ...existingPassenger, ...newPassengerData };
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
