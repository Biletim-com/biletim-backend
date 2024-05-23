import { Injectable, Inject, Logger } from '@nestjs/common';
import { Client } from 'nestjs-soap';
import * as xml2js from 'xml2js';

@Injectable()
export class BiletallService {
  private readonly logger = new Logger(BiletallService.name);
  private readonly parser = new xml2js.Parser({ explicitArray: false });

  constructor(@Inject('BiletallClient') private readonly client: Client) {}

  async getFirmalar() {
    const requestXml = `<Firmalar_2 xmlns=""></Firmalar_2>`;
    const requestYetki = `<Kullanici><Adi>biletimcomWS</Adi><Sifre>aa8809</Sifre></Kullanici>`;
    const rawResponse = await this.client.XmlIslet({
      xmlIslem: requestXml,
      xmlYetki: requestYetki,
    });
    this.logger.log(`Raw Firmalar Response: ${JSON.stringify(rawResponse)}`);

    if (!rawResponse) {
      this.logger.error('Firmalar Response is undefined');
      throw new Error('Firmalar Response is undefined');
    }

    const [result] = rawResponse;
    return this.parseXml(result);
  }

  async getKaraNoktalari() {
    const requestXml = `<KaraNoktaGetirKomut xmlns=""></KaraNoktaGetirKomut>`;
    const requestYetki = `<Kullanici><Adi>biletimcomWS</Adi><Sifre>aa8809</Sifre></Kullanici>`;
    const rawResponse = await this.client.XmlIslet({
      xmlIslem: requestXml,
      xmlYetki: requestYetki,
    });
    this.logger.log(`Raw Firmalar Response: ${JSON.stringify(rawResponse)}`);

    if (!rawResponse) {
      this.logger.error('Firmalar Response is undefined');
      throw new Error('Firmalar Response is undefined');
    }

    const [result] = rawResponse;
    return this.parseXml(result);
  }

  async getSeferListesi(params: any) {
    const requestXml = `
      <Sefer xmlns="">
        <FirmaNo>0</FirmaNo>
        <KalkisNoktaID>${params.KalkisNoktaID}</KalkisNoktaID>
        <VarisNoktaID>${params.VarisNoktaID}</VarisNoktaID>
        <Tarih>${params.Tarih}</Tarih>
        <AraNoktaGelsin>${params.AraNoktaGelsin}</AraNoktaGelsin>
        <IslemTipi>${params.IslemTipi}</IslemTipi>
        <YolcuSayisi>${params.YolcuSayisi}</YolcuSayisi>
        <Ip>${params.Ip}</Ip>
      </Sefer>`;
    const requestYetki = `<Kullanici><Adi>biletimcomWS</Adi><Sifre>aa8809</Sifre></Kullanici>`;
    const rawResponse = await this.client.XmlIslet({
      xmlIslem: requestXml,
      xmlYetki: requestYetki,
    });
    this.logger.log(`Raw Firmalar Response: ${JSON.stringify(rawResponse)}`);

    if (!rawResponse) {
      this.logger.error('Firmalar Response is undefined');
      throw new Error('Firmalar Response is undefined');
    }

    const [result] = rawResponse;
    return this.parseXml(result);
  }

  async getTicketDetails(ticketId: string) {
    const requestXml = `
      <BiletDetay xmlns="">
        <TicketId>${ticketId}</TicketId>
      </BiletDetay>`;
    const requestYetki = `<Kullanici><Adi>biletimcomWS</Adi><Sifre>aa8809</Sifre></Kullanici>`;
    const rawResponse = await this.client.XmlIslet({
      xmlIslem: requestXml,
      xmlYetki: requestYetki,
    });
    this.logger.log(`Raw Firmalar Response: ${JSON.stringify(rawResponse)}`);

    if (!rawResponse) {
      this.logger.error('Firmalar Response is undefined');
      throw new Error('Firmalar Response is undefined');
    }

    const [result] = rawResponse;
    return this.parseXml(result);
  }

  private async parseXml(xml: string): Promise<any> {
    try {
      const parsedResult = await this.parser.parseStringPromise(xml);
      return parsedResult;
    } catch (error) {
      this.logger.error(`XML Parsing Error: ${error.message}`);
      throw new Error('Error parsing XML response');
    }
  }
}
