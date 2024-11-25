import { Module } from '@nestjs/common';
import { ConfigModule } from '@app/configs/config.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

// Common
import { LoggerModule } from '@app/providers/logger/logger.module';

// Auth Module
import { AuthModule } from '@app/auth/auth.module';

// App Modules
import { UsersModule } from '@app/modules/users/users.module';
import { TicketsModule } from '@app/modules/tickets/tickets.module';
import { PanelUsersModule } from '@app/modules/panel-users/panel-users.module';
import { HotelModule } from '@app/modules/booking/hotel/hotel.module';
import { BookingModule } from '@app/modules/booking/booking.module';
import { PassengersModule } from '@app/modules/passengers/passengers.module';
import { BankCardsModule } from '@app/modules/bank-cards/bank-cards.module';
import { TransactionsModule } from '@app/modules/transactions/transactions.module';
import { WalletsModule } from '@app/modules/wallets/wallets.module';

// Providers
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';
import { RestClientModule } from '@app/providers/rest-client/provider.module';
import { PoxClientModule } from '@app/providers/pox-client/provider.module';
import { EventEmitterModule } from '@app/providers/event-emitter/provider.module';
import { QueueProviderModule } from './providers/queue/provider.module';
import { NetGsmModule } from './providers/sms/netgsm/provider.module';

// Interceptors
import { ErrorInterceptor } from '@app/common/interceptors';

// Jobs
import { JobsModule } from '@app/jobs/jobs.module';
import { NotificationsModule } from './notifications/notifications.module';
import { InsuranceModule } from './modules/insurance/insurance.module';


@Module({
  imports: [
    ConfigModule,
    EventEmitterModule,
    RestClientModule,
    PoxClientModule,
    LoggerModule,
    PostgreSQLProviderModule,
    JobsModule,
    NotificationsModule,
    AuthModule,
    UsersModule,
    PanelUsersModule,
    HotelModule,
    TicketsModule,
    BookingModule,
    PassengersModule,
    BankCardsModule,
    TransactionsModule,
    WalletsModule,
    InsuranceModule,
    QueueProviderModule,
    NetGsmModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
})
export class AppModule {}
