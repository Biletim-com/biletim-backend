import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';
import axios from 'axios';
import { CompanyRequestDto, ScheduleListRequestDto } from './dto/biletall.dto';

@Injectable()
export class BiletAllService {
  private accountName = 'biletimcomWS';
  private password = 'aa8809';

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

  async company(requestDto: CompanyRequestDto): Promise<any> {
    const firmalarXml = `<Firmalar>${requestDto.FirmaNo}</Firmalar>`;
    return this.run(firmalarXml, 'http://tempuri.org/XmlIslet');
  }

  async stopPoints(): Promise<any> {
    const firmalarXml = `<KaraNoktaGetirKomut/>`;
    return this.run(firmalarXml, 'http://tempuri.org/XmlIslet');
  }

  async scheduleList(requestDto: ScheduleListRequestDto): Promise<any> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      Sefer: {
        FirmaNo: requestDto.FirmaNo,
        KalkisNoktaID: requestDto.KalkisNoktaID,
        VarisNoktaID: requestDto.VarisNoktaID,
        Tarih: requestDto.Tarih,
        IslemTipi: requestDto.IslemTipi,
        YolcuSayisi: requestDto.YolcuSayisi,
        Ip: requestDto.Ip,
        ...(requestDto.AraNoktaGelsin !== undefined && {
          AraNoktaGelsin: requestDto.AraNoktaGelsin ? 1 : 0,
        }),
      },
    };
    const xml = builder.buildObject(requestDocument);
    return this.run(xml, 'http://tempuri.org/XmlIslet');
  }

  private async run(bodyXml: string, soapAction: string): Promise<any> {
    const accountDocument = this.getAccountDocument();
    const soapEnvelope = `
      <?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <XmlIslet xmlns="http://tempuri.org/">
            <xmlIslem>
              <KaraNoktaGetirKomut/>
            </xmlIslem>
            <xmlYetki>
              <Kullanici><Adi>biletimcomWS</Adi><Sifre>aa8809</Sifre></Kullanici>
            </xmlYetki>
          </XmlIslet>
        </soap:Body>
      </soap:Envelope>
    `;

    console.log('SOAP Envelope:', soapEnvelope); // Log the SOAP envelope to check for errors

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

      console.log('Response:', response.data); // Log the response to check for errors
      const result = await xml2js.parseStringPromise(response.data);
      return result;
    } catch (error) {
      console.error('Error running XML request:', error);
      throw new Error('Failed to process XML request');
    }
  }
}
