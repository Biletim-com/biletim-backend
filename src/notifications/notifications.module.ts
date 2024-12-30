import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

// modules
import { QueueProviderModule } from '@app/providers/queue/provider.module';

// services
import { NotificationsConfigService } from '@app/configs/notifications';
import { AuthConfigService } from '@app/configs/auth';
import { EmailNotificationService } from './services/email-notification.service';

// processors
import { EmailNotificationProcessor } from './proccessors/email-notification.proccessor';
import { QueueEnum } from '@app/common/enums';
import { SMSNotificationProcessor } from './proccessors/sms-notification.proccessor';
import { SMSNotificationService } from './services/sms-notification.service';

// helpers
import { HandlerbarsHelper } from '@app/common/helpers';

@Module({
  imports: [
    QueueProviderModule.registerQueue([
      {
        name: QueueEnum.EMAIL_QUEUE,
      },
      {
        name: QueueEnum.SMS_QUEUE,
      },
    ]),
    MailerModule.forRootAsync({
      useFactory: (notificationsConfigService: NotificationsConfigService) => ({
        transport: {
          name: notificationsConfigService.emailHost,
          host: notificationsConfigService.emailHost,
          port: notificationsConfigService.emailPort,
          secure: notificationsConfigService.emailUseSSL,
          auth: {
            user: notificationsConfigService.emailUsername,
            pass: notificationsConfigService.emailPassword,
          },
        },
        defaults: {
          from: `"Biletim Team" <${notificationsConfigService.emailFrom}>`,
        },
        template: {
          dir: `${__dirname}/../providers/html-template/templates`,
          adapter: new HandlebarsAdapter(HandlerbarsHelper.helpers),
        },
      }),
      inject: [NotificationsConfigService],
    }),
  ],
  providers: [
    EmailNotificationService,
    EmailNotificationProcessor,
    SMSNotificationProcessor,
    SMSNotificationService,
    AuthConfigService,
  ],
})
export class NotificationsModule {}
