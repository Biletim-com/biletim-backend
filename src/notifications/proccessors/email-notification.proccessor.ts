import { MailerService } from '@nestjs-modules/mailer';
import { INotificationProccessor } from '../interfaces/notification.interface';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { NotificationsOptions } from '../types/send-notifications-options.type';



@Processor('emailQueue')
export class EmailNotificationProcessor implements INotificationProccessor{
  constructor(private readonly mailerService: MailerService) {}
  
  @Process()
  async send(job: Job<NotificationsOptions>) {
    const { recipient, subject, options } = job.data;
    await this.mailerService.sendMail({
      to: recipient,
      subject,
      ...options,
    });
  }
}