import { Module } from '@nestjs/common';
import { InsuranceController } from './insurance.controller';
import { InsuranceService } from './services/insurance.service';
import { TravelHealthInsuranceService } from './providers/tamamliyo/services/travel-health-insurance.service';
import { TamamliyoService } from './providers/tamamliyo/services/tamamliyo.service';
import { HttpModule } from '@nestjs/axios';
import { TicketCancellationProtectionInsuranceService } from './providers/tamamliyo/services/ticket-cancellation-protection.service';

@Module({
  imports: [InsuranceModule, HttpModule],
  providers: [
    InsuranceService,
    TravelHealthInsuranceService,
    TamamliyoService,
    TicketCancellationProtectionInsuranceService,
  ],
  controllers: [InsuranceController],
})
export class InsuranceModule {}
