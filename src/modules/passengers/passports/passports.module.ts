import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { Passport } from './passport.entity';
import { PassportsController } from './passports.controller';
import { PassportsService } from './passports.service';
import { PassportsRepository } from './passports.repository';
import { PassengersRepository } from '../passengers.repository';

@Module({
  imports: [PostgreSQLProviderModule.forFeature([Passport])],
  controllers: [PassportsController],
  providers: [PassportsService, PassportsRepository, PassengersRepository],
})
export class PassportsModule {}
