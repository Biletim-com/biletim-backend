<<<<<<< Updated upstream:src/providers/ticket/biletall/services/biletall-request.service.ts
=======
import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';

>>>>>>> Stashed changes:src/common/services/biletall.service.ts
import * as xml2js from 'xml2js';
import axios from 'axios';

export class BiletAllRequestService {
  constructor(
    private readonly baseUrl: string,
    private readonly username: string,
    private readonly password: string,
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
                  <Adi>${this.username}</Adi>
                  <Sifre>${this.password}</Sifre>
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
        this.baseUrl,
        soapEnvelope.trim(),
        config,
      );
      if (!response || !response.data) {
        throw new Error('Response is undefined.');
      }
      fs.writeFileSync(
        path.join(__dirname, 'domestic-flighst.txt'),
        response.data,
      );
      return xml2js.parseStringPromise(response.data) as T;
    } catch (error) {
      console.error('Error running XML request:', error);
      throw new Error('Failed to process XML request');
    }
  }
}
