import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { CompanyRequestDto, ScheduleListRequestDto } from './dto/biletall.dto';

@Injectable()
export class BiletAllService {
  constructor(private configService: ConfigService) {}

  async company(requestDto: CompanyRequestDto): Promise<any> {
    const firmalarXml = `<Firmalar>${requestDto.FirmaNo}</Firmalar>`;
    return this.run(firmalarXml);
  }

  async stopPoints(): Promise<any> {
    const firmalarXml = `<KaraNoktaGetirKomut/>`;
    return this.run(firmalarXml);
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
    return this.run(xml);
  }

  private async run(bodyXml: string): Promise<any> {
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
                <Adi>${this.configService.get<string>('BILETALL_WS_USERNAME')}</Adi>
                <Sifre>${this.configService.get<string>('BILETALL_WS_PASSWORD')}</Sifre>
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

    //console.log('SOAP Envelope:', soapEnvelope);

    try {
      const response = await axios.post(
        this.configService.get<string>('BILETALL_WSDL_URI'), 
        soapEnvelope.trim(),
        config,
      );

      //console.log('Response:', response.data);
      const result = await xml2js.parseStringPromise(response.data);
      return result;
    } catch (error) {
      console.error('Error running XML request:', error);
      throw new Error('Failed to process XML request');
    }
  }
}
