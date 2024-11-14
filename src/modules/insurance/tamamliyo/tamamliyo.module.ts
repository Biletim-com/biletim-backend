import { Module } from '@nestjs/common';
import { RestClientService } from '@app/providers/rest-client/provider.service';
import { TamamliyoService } from './services/tamamliyo.service';
import { HttpModule } from '@nestjs/axios';
import { TamamliyoController } from './tamamliyo.controller';
import { TravelHealthInsuranceService } from './services/travel-health-insurance/travel-health-insurance.service';

@Module({
  imports: [HttpModule],
  providers: [
    TamamliyoService,
    RestClientService,
    TravelHealthInsuranceService,
  ],
  controllers: [TamamliyoController],
})
export class TamamliyoModule {}
