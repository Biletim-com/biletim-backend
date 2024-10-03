import { Injectable } from '@nestjs/common';

import * as xml2js from 'xml2js';
import axios from 'axios';

import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';

@Injectable()
export class BiletAllService {
  constructor(
    private readonly biletAllApiConfigService: BiletAllApiConfigService,
  ) {}

  public async run<T>(bodyXml: string): Promise<T> {
    const soapEnvelope = `
        <?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://tempuri.org/">
          <soap:Body>
            <tns:XmlIslet>
              <tns:xmlIslem>
                ${bodyXml}
              </tns:xmlIslem>
              <tns:xmlYetki>
                <Kullanici>
                  <Adi>${this.biletAllApiConfigService.biletAllApiUsername}</Adi>
                  <Sifre>${this.biletAllApiConfigService.biletAllApiPassword}</Sifre>
                </Kullanici>
              </tns:xmlYetki>
            </tns:XmlIslet>
          </soap:Body>
        </soap:Envelope>`;

    const config = {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
    };

    try {
      const response = await axios.post(
        this.biletAllApiConfigService.biletAllApiBaseUrl,
        soapEnvelope.trim(),
        config,
      );
      if (!response || !response.data) {
        throw new Error('Response is undefined.');
      }
      return xml2js.parseStringPromise(response.data) as T;
    } catch (error) {
      console.error('Error running XML request:', error);
      throw new Error('Failed to process XML request');
    }
  }
}
