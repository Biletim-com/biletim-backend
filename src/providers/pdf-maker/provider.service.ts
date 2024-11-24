import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';

@Injectable()
export class PdfMakerService implements OnModuleInit {
  private browser: Browser;
  private logger = new Logger(PdfMakerService.name);
  private options = {
    format: 'a4' as const,
    scale: 0.78,
  };

  async onModuleInit() {
    this.browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium-browser',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      pipe: true,
    });
    this.logger.log('Puppeteer browser is initialized');
  }

  public async createPdf(html: string): Promise<Uint8Array> {
    const page = await this.browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf(this.options);

    await page.close();

    return pdf;
  }
}
