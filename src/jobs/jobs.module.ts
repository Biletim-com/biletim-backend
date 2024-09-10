import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BusTerminalsCronJobModule } from './bus-terminals/job.module';
import { AirportsCronJobModule } from './airports/job.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BusTerminalsCronJobModule,
    AirportsCronJobModule,
  ],
})
export class JobsModule {}
