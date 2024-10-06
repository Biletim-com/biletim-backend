import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
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

// Providers
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

// Interceptors
import { ErrorInterceptor } from '@app/common/interceptors';

// Jobs
import { JobsModule } from '@app/jobs/jobs.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EventEmitterModule } from '@nestjs/event-emitter/dist/event-emitter.module';

@Module({
  imports: [
    AuthModule,
    HttpModule,
    LoggerModule,
    ConfigModule,
    PostgreSQLProviderModule,
    JobsModule,
    UsersModule,
    PanelUsersModule,
    NotificationsModule,
    EventEmitterModule.forRoot(),
    HotelModule,
    TicketsModule,
    BookingModule,
    PassengersModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
})
export class AppModule {}
