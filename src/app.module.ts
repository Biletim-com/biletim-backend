import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { TicketsService } from './tickets/tickets.service';
import { BiletAllModule } from './tickets/biletall/biletall.module';
import { PanelUsersModule } from './panel-users/panel-users.module';
import { AppleModule } from './apple/apple.module';
import { HotelModule } from './booking/hotel/hotel.module';
import { HotelService } from './booking/hotel/hotel.service';
import { HttpModule } from '@nestjs/axios';
import { BookingModule } from './booking/booking.module';
import { ConfigModule } from './configs/config.module';
import { PostgreSQLProviderModule } from './providers/database/postgresql/provider.module';

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
  providers: [TicketsService, HotelService],
})
export class AppModule {}
