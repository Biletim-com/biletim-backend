import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';
import { Verification } from './verification.entity';
import { VerificationsRepository } from './verification.repository';
import { VerificationService } from './verification.service';

@Module({
  imports: [
    PostgreSQLProviderModule.forFeature([Verification]),
  ],
  providers: [
    VerificationsRepository,
    VerificationService,
  ],
  exports: [
    VerificationsRepository,
    VerificationService,
  ],
})
export class VerificationsModule {}
