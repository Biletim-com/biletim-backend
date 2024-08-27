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
import { PlaneModule } from './modules/tickets/plane/plane.module';
import { BusModule } from './modules/tickets/bus/bus.module';

// Providers
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

// Interceptors
import { ErrorInterceptor } from '@app/common/interceptors/error.interseptor';

// Jobs
import { JobsModule } from '@app/jobs/jobs.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    PostgreSQLProviderModule,
    JobsModule,
    AuthModule,
    UsersModule,
    TicketsModule,
    PanelUsersModule,
    AppleModule,
    HotelModule,
    HttpModule,
    BookingModule,
    PlaneModule,
    BusModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
})
export class AppModule {}
