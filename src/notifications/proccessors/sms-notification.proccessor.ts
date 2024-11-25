import { Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

// interfaces
import { INotificationProccessor } from '../interfaces/notification.interface';

// types
import { NotificationsOptions, SMSNotificationsOptions } from '../types/send-notifications-options.type';

// enums
import { QueueEnum } from '@app/common/enums';
import { NetGsmProviderService } from '@app/providers/sms/netgsm/provider.service';

@Processor(QueueEnum.SMS_QUEUE)
export class SMSNotificationProcessor implements INotificationProccessor {
  private readonly logger = new Logger(SMSNotificationProcessor.name);

  constructor(private readonly smsService: NetGsmProviderService) {}

  @Process()
  async send(job: Job<SMSNotificationsOptions>) {
    const { messsage, gsmno } = job.data;
    await this.smsService.sendSMS(
      messsage,
      gsmno
    );
  }
}
