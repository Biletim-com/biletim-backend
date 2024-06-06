import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { TicketsService } from './tickets/tickets.service';
import { BiletAllModule } from './tickets/biletall/biletall.module';
import { PanelUsersModule } from './panel-users/panel-users.module';
import { AppleModule } from './apple/apple.module';
import { HotelModule } from './hotel/hotel.module';
import { HotelService } from './hotel/hotel.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    TicketsModule,
    BiletAllModule,
    PanelUsersModule,
    AppleModule,
    HotelModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, TicketsService, HotelService],
})
export class AppModule {}
