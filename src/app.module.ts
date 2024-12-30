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
import { VerificationsModule } from '@app/modules/verification/verifications.module';
import { OrderReturnModule } from '@app/order-return/order-return.module';
import { TicketsModule } from '@app/modules/tickets/tickets.module';
import { OrdersModule } from '@app/modules/orders/orders.module';
import { InvoiceAddressModule } from '@app/modules/users/invoice-address/inovice-address.module';
import { PaymentModule } from './payment/payment.module';
import { SearchModule } from './search/search.module';

// Providers
import { JwtModule } from '@app/providers/jwt/provider.module';
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';
import { MongoDBProviderModule } from '@app/providers/database/mongodb/provider.module';
import { RestClientModule } from '@app/providers/rest-client/provider.module';
import { PoxClientModule } from '@app/providers/pox-client/provider.module';
import { EventEmitterModule } from '@app/providers/event-emitter/provider.module';
import { QueueProviderModule } from './providers/queue/provider.module';
import { SmsModule } from './providers/sms/provider.module';
import { PdfMakerModule } from '@app/providers/pdf-maker/provider.module';
import { HtmlTemplateModule } from '@app/providers/html-template/provider.module';
import { PaymentProviderModule } from './providers/payment/provider.module';
import { NotificationsModule } from './notifications/notifications.module';

// Interceptors
import { ErrorInterceptor, UserInterceptor } from '@app/common/interceptors';

// Jobs
import { JobsModule } from '@app/jobs/jobs.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    JwtModule,
    EventEmitterModule,
    RestClientModule,
    PoxClientModule,
    PdfMakerModule,
    HtmlTemplateModule,
    JobsModule,
    PostgreSQLProviderModule,
    MongoDBProviderModule,
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
    OrdersModule,
    TransactionsModule,
    WalletsModule,
    QueueProviderModule,
    SmsModule,
    VerificationsModule,
    PaymentProviderModule,
    InvoiceAddressModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
  ],
})
export class AppModule {}
