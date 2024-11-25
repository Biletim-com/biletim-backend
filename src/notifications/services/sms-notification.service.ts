import { Injectable, Logger } from '@nestjs/common';

import { SendSmsNotificationDto, SendVerifyAccountEmailNotificationDto } from '@app/common/dtos/send-email-notification.dto';
import { OnEvent, OnEvents } from '@app/providers/event-emitter/decorators';

import { AuthConfigService } from '@app/configs/auth';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class SMSNotificationService {
  private readonly logger = new Logger(SMSNotificationService.name);

  constructor(
    @InjectQueue('smsQueue')
    private readonly queue: Queue
  ) { }

  @OnEvent('user.sms')
  async sendSms({
    messsage,
    gsmno,
  }: SendSmsNotificationDto): Promise<void> {
    await this.queue.add({
      messsage,
      gsmno
    });
}

}
