import { Module } from '@nestjs/common';
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { Passenger } from './passenger.entity';
import { PassengersRepository } from './passengers.repository';
import { PassengersService } from './passengers.service';
import { PassengersController } from './passengers.controller';

// modules
import { PassportsModule } from './passports/passports.module';
import { AuthModule } from '@app/auth/auth.module';
import { UsersModule } from '../users/users.module';
import { PanelUsersModule } from '../panel-users/panel-users.module';

@Module({
  imports: [
    AuthModule,
    PassportsModule,
    UsersModule,
    PanelUsersModule,
    PostgreSQLProviderModule.forFeature([Passenger]),
  ],
  providers: [PassengersRepository, PassengersService],
  controllers: [PassengersController],
})
export class PassengersModule {}
