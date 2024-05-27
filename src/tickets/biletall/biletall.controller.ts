import { Controller, Get, Query } from '@nestjs/common';
import { BiletAllService } from './biletall.service';

@Controller('biletall')
export class BiletAllController {
  constructor(private readonly biletAllService: BiletAllService) {}

  @Get('company')
  async company(@Query('companyNo') companyNo: string) {
    return this.biletAllService.company(companyNo);
  }

  @Get('stop-points')
  async stopPoints() {
    return this.biletAllService.stopPoints();
  }

  @Get('schedule-list')
  async scheduleList(@Query() requestModel: any) {
    return this.biletAllService.scheduleList(requestModel);
  }
}
