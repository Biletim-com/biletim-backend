import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { BiletallService } from './tickets/biletall/biletall.service';
import { TicketsService } from './tickets/tickets.service';
import { CommandModule } from 'nestjs-command';
import { CommandService } from './commands/command.service';
import { SuperAdminCommand } from './commands/super-admin.command';
import { BiletallModule } from './tickets/biletall/biletall.module';
import { PanelUsersModule } from './panel-users/panel-users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    TicketsModule,
    CommandModule,
    BiletallModule,
    PanelUsersModule,
  ],
  controllers: [AppController],
  providers: [
    SuperAdminCommand,
    CommandService,
    AppService,
    BiletallService,
    TicketsService,
  ],
})
export class AppModule {}
