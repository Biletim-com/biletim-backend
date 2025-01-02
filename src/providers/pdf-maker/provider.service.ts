import { ChromiumConfigService } from '@app/configs/chromium';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer-core';

@Injectable()
export class PdfMakerService implements OnModuleInit {
  private browser: Browser;
  private logger = new Logger(PdfMakerService.name);
  private options = { format: 'a4' as const, printBackground: true };

  constructor(private readonly chromiumConfigService: ChromiumConfigService) {}

  async onModuleInit() {
    try {
      this.browser = await puppeteer.connect({
        browserWSEndpoint: `ws://${this.chromiumConfigService.host}:${this.chromiumConfigService.port}`,
      });
      this.logger.log('Chromium browser is initialized');
    } catch (err) {
      this.logger.error(`Error connecting to Chromium: ${err.message}`);
    }
  }

  public async createPdf(html: string): Promise<Uint8Array> {
    const page = await this.browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf(this.options);

    await page.close();

    return pdf;
  }
}
