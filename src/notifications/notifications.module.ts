import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { NotificationsConfigService } from '@app/configs/notifications';
import { AuthConfigService } from '@app/configs/auth';

import { EmailNotificationService } from './services/email-notification.service';
import { EmailNotificationProcessor} from './proccessors/email-notification.proccessor';
import { QueueProviderModule } from '@app/providers/queue/provider.module';

@Module({
  imports: [
    QueueProviderModule.registerQueue(
      [
        {
          name: "emailQueue"
        }
      ]
    ),
    MailerModule.forRootAsync({
      useFactory: (notificationsConfigService: NotificationsConfigService) => ({
        transport: {
          name: notificationsConfigService.emailHost,
          host: notificationsConfigService.emailHost,
          port: notificationsConfigService.emailPort,
          secure: false,
          auth: {
            user: notificationsConfigService.emailUsername,
            pass: notificationsConfigService.emailPassword,
          },
        },
        defaults: {
          from: `"Biletim Team" <${notificationsConfigService.emailUsername}>`,
        },
        template: {
          dir: `${__dirname}/templates`,
          adapter: new HandlebarsAdapter(),
        },
      }),
      inject: [NotificationsConfigService],
    }),
  ],
  providers: [
    EmailNotificationService,
    EmailNotificationProcessor,
    AuthConfigService,
  ],
})
export class NotificationsModule {}
