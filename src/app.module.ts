import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@app/configs/config.module';

// Auth Module
import { AuthModule } from '@app/auth/auth.module';
import { AppleModule } from './apple/apple.module';

// App Modules
import { UsersModule } from '@app/modules/users/users.module';
import { TicketsModule } from '@app/modules/tickets/tickets.module';
import { BiletAllModule } from '@app/modules/tickets/biletall/biletall.module';
import { PanelUsersModule } from '@app/modules/panel-users/panel-users.module';
import { HotelModule } from '@app/modules/booking/hotel/hotel.module';
import { BookingModule } from '@app/modules/booking/booking.module';

// Providers
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

@Module({
  imports: [
    ConfigModule,
    PostgreSQLProviderModule,
    PrismaModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    TicketsModule,
    BiletAllModule,
    PanelUsersModule,
    AppleModule,
    HotelModule,
    HttpModule,
    BookingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
