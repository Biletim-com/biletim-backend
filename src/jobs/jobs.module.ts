import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { StopPointsCronJobModule } from './stop-points/job.module';

@Module({
  imports: [ScheduleModule.forRoot(), StopPointsCronJobModule],
})
export class JobsModule {}
