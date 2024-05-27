import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';
import axios from 'axios';

@Injectable()
export class BiletAllService {
  private accountName = 'biletimcomWS';
  private password = '2023.Biletimcom';

  private getAccountDocument() {
    const builder = new xml2js.Builder({ headless: true });
    const accountDocument = {
      Kullanici: {
        Adi: this.accountName,
        Sifre: this.password,
      },
    };
    return builder.buildObject(accountDocument);
  }

  private async strToXmlDocument(str: string): Promise<any> {
    const parser = new xml2js.Parser({ explicitArray: false });
    return parser.parseStringPromise(str);
  }

  async company(companyNo = ''): Promise<any> {
    const builder = new xml2js.Builder({ headless: true });
    const companyFilter = companyNo ? { FirmaNo: companyNo } : {};
    const requestDocument = {
      Firmalar: companyFilter,
    };
    const xml = builder.buildObject(requestDocument);
    return this.run(xml, 'http://tempuri.org/XmlIslet');
  }

  async stopPoints(): Promise<any> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = { KaraNoktaGetirKomut: {} };
    const xml = builder.buildObject(requestDocument);
    return this.run(xml, 'http://tempuri.org/XmlIslet');
  }

  async scheduleList(requestModel: any): Promise<any> {
    const builder = new xml2js.Builder({ headless: true });
    const xml = builder.buildObject(requestModel);
    return this.run(xml, 'http://tempuri.org/XmlIslet');
  }

  async ucusFiyat(ucusFiyatModel: any): Promise<any> {
    const builder = new xml2js.Builder({ headless: true });
    const xml = builder.buildObject(ucusFiyatModel);
    return this.run(xml, 'http://tempuri.org/XmlIslet');
  }

  private async run(bodyXml: string, soapAction: string): Promise<any> {
    const accountDocument = this.getAccountDocument();
    const soapEnvelope = `
      <?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <soap:Body>
          <XmlIslet xmlns="http://tempuri.org/">
            <xmlIslem>
              ${bodyXml}
            </xmlIslem>
            <xmlYetki>
              ${accountDocument}
            </xmlYetki>
          </XmlIslet>
        </soap:Body>
      </soap:Envelope>
    `;

    try {
      const response = await axios.post(
        'http://94.55.20.137/WSTEST/Service.asmx?wsdl',
        soapEnvelope.trim(),
        {
          headers: {
            'Content-Type': 'text/xml',
            SOAPAction: soapAction,
          },
        },
      );

      const result = await xml2js.parseStringPromise(response.data);
      return result;
    } catch (error) {
      console.error('Error running XML request:', error);
      throw new Error('Failed to process XML request');
    }
  }
}
