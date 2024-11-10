import { Module } from '@nestjs/common';
import { InsuranceController } from './insurance.controller';
import { InsuranceService } from './insurance.service';
import { TravelHealthInsuranceModule } from './tamamliyo/travel-health-insurance/travel-health-insurance.module';

@Module({
  imports: [InsuranceModule, TravelHealthInsuranceModule],
  providers: [InsuranceService],
  controllers: [InsuranceController],
})
export class InsuranceModule {}
