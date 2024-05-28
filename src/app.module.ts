import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { BiletAllService } from './tickets/biletall/biletall.service';
import { TicketsService } from './tickets/tickets.service';
import { BiletAllModule } from './tickets/biletall/biletall.module';
import { PanelUsersModule } from './panel-users/panel-users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    TicketsModule,
    BiletAllModule,
    PanelUsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, BiletAllService, TicketsService],
})
export class AppModule {}
