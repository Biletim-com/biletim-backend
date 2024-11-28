import { Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

// interfaces
import { INotificationProccessor } from '../interfaces/notification.interface';

// types
import { NotificationsOptions } from '../types/send-notifications-options.type';

// enums
import { QueueEnum } from '@app/common/enums';

@Processor(QueueEnum.EMAIL_QUEUE)
export class EmailNotificationProcessor implements INotificationProccessor {
  private readonly logger = new Logger(EmailNotificationProcessor.name);

  constructor(private readonly mailerService: MailerService) {}

  @Process()
  async send(job: Job<NotificationsOptions>) {
    const { recipient, subject, options } = job.data;
    await this.mailerService.sendMail({
      to: recipient,
      subject,
      ...options,
      attachments: options.attachments?.map((attachment) => ({
        ...attachment,
        content: Buffer.from(attachment.content as Buffer),
      })),
    });
  }
}
