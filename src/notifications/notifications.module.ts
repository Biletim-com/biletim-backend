import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { NotificationsConfigService } from '@app/configs/notifications';
import { AuthConfigService } from '@app/configs/auth';

import { EmailNotificationService } from './services/email-notification.service';

import { EmailNotificationStrategy } from './strategies/email-notification.strategy';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (notificationsConfigService: NotificationsConfigService) => ({
        transport: {
          host: notificationsConfigService.emailHost,
          port: notificationsConfigService.emailPort,
          auth: {
            user: notificationsConfigService.emailUsername,
            pass: notificationsConfigService.emailPassword,
          },
        },
        defaults: {
          from: `"Biletim Team" <${notificationsConfigService.emailHost}>`,
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
    EmailNotificationStrategy,
    AuthConfigService,
  ],
})
export class NotificationsModule {}
