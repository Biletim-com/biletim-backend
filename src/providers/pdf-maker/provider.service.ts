import { Injectable } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';

@Injectable()
export class PdfMakerService {
  private browser: Promise<Browser>;
  private options = {
    format: 'a4' as const,
    scale: 0.78,
  };

  constructor() {
    if (!this.browser) {
      console.log('BROWSER DOES NOT EXIST');
      this.browser = puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
        pipe: true,
      });
    }
  }

  public async createPdf(html: string): Promise<Uint8Array> {
    const page = await (await this.browser).newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf(this.options);

    await page.close();

    return pdf;
  }
}
