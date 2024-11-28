import { Injectable, Logger } from '@nestjs/common';

import { SendSmsNotificationDto } from '@app/common/dtos';
import { OnEvent, OnEvents } from '@app/providers/event-emitter/decorators';

import { AuthConfigService } from '@app/configs/auth';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QueueEnum } from '@app/common/enums';

@Injectable()
export class SMSNotificationService {
  private readonly logger = new Logger(SMSNotificationService.name);

  constructor(
    @InjectQueue(QueueEnum.SMS_QUEUE)
    private readonly queue: Queue,
  ) {}

  @OnEvent('user.sms')
  async sendSms({ messsage, gsmno }: SendSmsNotificationDto): Promise<void> {
    await this.queue.add({
      messsage,
      gsmno,
    });
  }
}
