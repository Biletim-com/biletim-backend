import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@app/configs/config.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

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
import { ErrorInterceptor } from './common/interceptors/error.interseptor';

@Module({
  imports: [
    ConfigModule,
    PostgreSQLProviderModule,
    AuthModule,
    UsersModule,
    TicketsModule,
    PanelUsersModule,
    AppleModule,
    HotelModule,
    HttpModule,
    BookingModule,
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
