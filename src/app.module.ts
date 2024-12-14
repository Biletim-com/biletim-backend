import { Module } from '@nestjs/common';
import { ConfigModule } from '@app/configs/config.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

// Common
import { LoggerModule } from '@app/providers/logger/logger.module';

// Auth Module
import { AuthModule } from '@app/auth/auth.module';

// App Modules
import { UsersModule } from '@app/modules/users/users.module';
import { PanelUsersModule } from '@app/modules/panel-users/panel-users.module';
import { PassengersModule } from '@app/modules/passengers/passengers.module';
import { BankCardsModule } from '@app/modules/bank-cards/bank-cards.module';
import { TransactionsModule } from '@app/modules/transactions/transactions.module';
import { WalletsModule } from '@app/modules/wallets/wallets.module';
import { VerificationsModule } from './modules/verification/verifications.module';
import { PaymentModule } from './payment/payment.module';
import { OrderReturnModule } from './order-return/order-return.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { SearchModule } from './search/search.module';

// Providers
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';
import { RestClientModule } from '@app/providers/rest-client/provider.module';
import { PoxClientModule } from '@app/providers/pox-client/provider.module';
import { EventEmitterModule } from '@app/providers/event-emitter/provider.module';
import { QueueProviderModule } from './providers/queue/provider.module';
import { SmsModule } from './providers/sms/provider.module';
import { PdfMakerModule } from '@app/providers/pdf-maker/provider.module';
import { HtmlTemplateModule } from '@app/providers/html-template/provider.module';
import { PaymentProviderModule } from './providers/payment/provider.module';

// Interceptors
import { ErrorInterceptor } from '@app/common/interceptors';

// Jobs
import { JobsModule } from '@app/jobs/jobs.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule,
    EventEmitterModule,
    RestClientModule,
    PoxClientModule,
    PdfMakerModule,
    HtmlTemplateModule,
    LoggerModule,
    PostgreSQLProviderModule,
    JobsModule,
    NotificationsModule,
    AuthModule,
    UsersModule,
    PanelUsersModule,
    TicketsModule,
    SearchModule,
    PaymentModule,
    OrderReturnModule,
    PassengersModule,
    BankCardsModule,
    TransactionsModule,
    WalletsModule,
    QueueProviderModule,
    SmsModule,
    VerificationsModule,
    PaymentProviderModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
})
export class AppModule {}
