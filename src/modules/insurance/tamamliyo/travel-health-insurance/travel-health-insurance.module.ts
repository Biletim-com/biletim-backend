import { Module } from '@nestjs/common';
import { TravelHealthInsuranceController } from './travel-health-insurance.controller';
import { TravelHealthInsuranceService } from './travel-health-insurance.service';
import { RestClientService } from '@app/providers/rest-client/provider.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TravelHealthInsuranceModule, HttpModule],
  providers: [TravelHealthInsuranceService, RestClientService],
  controllers: [TravelHealthInsuranceController],
})
export class TravelHealthInsuranceModule {}
