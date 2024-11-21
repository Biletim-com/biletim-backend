import { Injectable } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';

@Injectable()
export class PdfMakerService {
  private browser: Browser | undefined;

  private options = {
    format: 'a4' as const,
    scale: 0.78,
  };

  public async createPdf(html: string): Promise<Uint8Array> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: 'chromium-browser',
        pipe: true,
      });
    }
    const page = await this.browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf(this.options);

    await page.close();

    return pdf;
  }
}
