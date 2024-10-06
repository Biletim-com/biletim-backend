import { Global, Module } from '@nestjs/common';
import { EventEmitterModule as NestJsEventEmitterModule } from '@nestjs/event-emitter';

import { EventEmitterService } from './provider.service';

@Global()
@Module({
  imports: [
    NestJsEventEmitterModule.forRoot({
      delimiter: '.',
      global: true,
    }),
  ],
  providers: [EventEmitterService],
  exports: [EventEmitterService],
})
export class EventEmitterModule {}
