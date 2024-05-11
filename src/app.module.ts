import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TıcketsModule } from './tıckets/tıckets.module';
import { TicketsModule } from './tickets/tickets.module';
import { TıcketsService } from './tıckets/tıckets.service';
import { BiletallService } from './biletall/biletall.service';
import { TicketsService } from './biletall/tickets/tickets.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    TıcketsModule,
    TicketsModule
  ],
  controllers: [AppController],
  providers: [AppService, TıcketsService, BiletallService, TicketsService],
})
export class AppModule {}
