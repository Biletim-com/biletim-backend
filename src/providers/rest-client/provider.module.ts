import { Global, Module } from '@nestjs/common';

import { RestClientService } from './provider.service';

@Global()
@Module({
  providers: [RestClientService],
  exports: [RestClientService],
})
export class RestClientModule {}
