import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { EventsMap } from './events';

@Injectable()
export class EventEmitterService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emitEvent<K extends keyof EventsMap>(eventName: K, payload: EventsMap[K]) {
    this.eventEmitter.emit(eventName, payload);
  }
}
