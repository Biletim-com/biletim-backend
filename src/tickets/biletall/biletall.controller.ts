import { Controller, Get, Post, Body } from '@nestjs/common';
import { BiletAllService } from './biletall.service';
import { ScheduleListRequestDto, CompanyRequestDto } from './dto/biletall.dto';

@Controller('biletall')
export class BiletAllController {
  constructor(private readonly biletAllService: BiletAllService) {}

  @Post('company')
  async company(@Body() requestDto: CompanyRequestDto) {
    return this.biletAllService.company(requestDto);
  }

  @Get('stop-points')
  async stopPoints() {
    return this.biletAllService.stopPoints();
  }

  @Post('schedule-list')
  async scheduleList(@Body() requestDto: ScheduleListRequestDto) {
    return this.biletAllService.scheduleList(requestDto);
  }
}
