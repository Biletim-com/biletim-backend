import { Module } from '@nestjs/common';

import { NetGsmModule } from './netgsm/provider.module';

@Module({
  imports: [NetGsmModule],
})
export class SmsModule {}
