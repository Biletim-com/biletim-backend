import { Module, Global } from '@nestjs/common';
import { NetGsmProviderService } from './provider.service';

@Global()
@Module({
  providers: [NetGsmProviderService],
  exports: [NetGsmProviderService],
})
export class NetGsmModule {}