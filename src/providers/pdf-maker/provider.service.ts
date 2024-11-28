import { getContainerIp } from '@app/common/utils/get-container-ip.util';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer-core';

@Injectable()
export class PdfMakerService implements OnModuleInit {
  private browser: Browser;
  private logger = new Logger(PdfMakerService.name);
  private options = {
    format: 'a4' as const,
    scale: 0.78,
  };

  async onModuleInit() {
    console.log('START MODULE');

    const containerIp = await getContainerIp('chromium');

    const webSocket = await fetch(`http://${containerIp}:9222/json/version`);
    const { webSocketDebuggerUrl } = await webSocket.json();

    try {
      this.browser = await puppeteer.connect({
        browserWSEndpoint: webSocketDebuggerUrl,
      });
    } catch (err) {
      console.log('ERROR', err);
    }

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
