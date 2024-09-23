import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { Passport } from './passport.entity';

@Module({
  imports: [PostgreSQLProviderModule.forFeature([Passport])],
})
export class PassportsModule {}
