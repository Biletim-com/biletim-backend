import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@app/configs/config.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

// Common
import { LoggerModule } from '@app/common/logger/logger.module';

// Auth Module
import { AuthModule } from '@app/auth/auth.module';
import { AppleModule } from './apple/apple.module';

// App Modules
import { UsersModule } from '@app/modules/users/users.module';
import { TicketsModule } from '@app/modules/tickets/tickets.module';
import { PanelUsersModule } from '@app/modules/panel-users/panel-users.module';
import { HotelModule } from '@app/modules/booking/hotel/hotel.module';
import { BookingModule } from '@app/modules/booking/booking.module';

// Providers
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

// Interceptors
import { ErrorInterceptor } from '@app/common/interceptors/error.interseptor';

// Jobs
import { JobsModule } from '@app/jobs/jobs.module';

@Module({
  imports: [
    HttpModule,
    LoggerModule,
    ConfigModule,
    PostgreSQLProviderModule,
    JobsModule,
    AuthModule,
    UsersModule,
    PanelUsersModule,
    AppleModule,
    HotelModule,
    TicketsModule,
    BookingModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
})
export class AppModule {}
