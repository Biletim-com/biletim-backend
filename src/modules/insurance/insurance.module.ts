import { Module } from '@nestjs/common';
import { InsuranceController } from './insurance.controller';
import { InsuranceService } from './services/insurance.service';
import { TamamliyoModule } from './tamamliyo/tamamliyo.module';

@Module({
  imports: [InsuranceModule, TamamliyoModule],
  providers: [InsuranceService],
  controllers: [InsuranceController],
})
export class InsuranceModule {}
