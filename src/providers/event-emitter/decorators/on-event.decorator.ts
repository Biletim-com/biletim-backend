import { applyDecorators } from '@nestjs/common';
import { OnEvent as NestJsOnEvent } from '@nestjs/event-emitter';
import { OnEventOptions } from '@nestjs/event-emitter/dist/interfaces';

import { EventsMap } from '../events';

export function OnEvent<K extends keyof EventsMap>(
  eventName: K | K[],
  options?: OnEventOptions,
): MethodDecorator {
  return NestJsOnEvent(eventName, options);
}

export function OnEvents<K extends keyof EventsMap>(
  eventName: K[],
  options?: OnEventOptions,
) {
  return applyDecorators(...eventName.map((e) => OnEvent(e, options)));
}
