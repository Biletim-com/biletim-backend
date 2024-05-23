import { Controller, Get, Query, Param } from '@nestjs/common';
import { BiletallService } from './biletall.service';

@Controller('biletall')
export class BiletallController {
  constructor(private readonly biletallService: BiletallService) {}

  @Get('firmalar')
  async getFirmalar() {
    const result = await this.biletallService.getFirmalar();
    return result;
  }

  @Get('kara-noktalar')
  async getKaraNoktalari() {
    const result = await this.biletallService.getKaraNoktalari();
    return result;
  }

  @Get('seferler')
  async getSeferListesi(@Query() query: any) {
    const result = await this.biletallService.getSeferListesi(query);
    return result;
  }

  @Get('ticket/:ticketId')
  async getTicketDetails(@Param('ticketId') ticketId: string) {
    const result = await this.biletallService.getTicketDetails(ticketId);
    return result;
  }
}
