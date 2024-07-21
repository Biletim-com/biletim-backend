// src/biletall/biletall.service.ts

import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';
import axios from 'axios';
import {
  CompanyRequestDto,
  ScheduleListRequestDto,
  BusSearchRequestDto,
  BusSeatControlRequestDto,
  BoardingPointRequestDto,
  ServiceInformationRequestDto,
  BusSaleRequestDto,
  BusRouteRequestDto,
} from './dto/biletall.dto';

import { AppConfigService } from '@app/configs/app/config.service';

@Injectable()
export class BiletAllService {
  constructor(private appConfigService: AppConfigService) {}

  private async run(bodyXml: string): Promise<any> {
    const soapEnvelope = `
    <?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <XmlIslet xmlns="http://tempuri.org/">
            <xmlIslem>
              ${bodyXml}
            </xmlIslem>
            <xmlYetki>
              <Kullanici xmlns="">
                <Adi>${this.appConfigService.biletAllUsername}</Adi>
                <Sifre>${this.appConfigService.biletAllPassword}</Sifre>
              </Kullanici>
            </xmlYetki>
          </XmlIslet>
        </soap:Body>
      </soap:Envelope>`;
    const config = {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
    };

    try {
      const response = await axios.post(
        this.appConfigService.biletAllURI,
        soapEnvelope.trim(),
        config,
      );
      console.log(soapEnvelope);
      const jsonResponse = await xml2js.parseStringPromise(response.data, {
        explicitArray: false,
      });
      return jsonResponse;
    } catch (error) {
      console.error('Error running XML request:', error);
      throw new Error('Failed to process XML request');
    }
  }

  async company(requestDto: CompanyRequestDto): Promise<any> {
    const firmalarXml = `<Firmalar_2 xmlns=""><FirmaNo>${requestDto.FirmaNo}</FirmaNo></Firmalar_2>`;
    return this.run(firmalarXml);
  }

  async stopPoints(): Promise<any> {
    const stopPointsXml = `<KaraNoktaGetirKomut xmlns=""/>`;
    return this.run(stopPointsXml);
  }

  async scheduleList(requestDto: ScheduleListRequestDto): Promise<any> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      Sefer: {
        $: {
          xmlns: '',
        },
        FirmaNo: requestDto.FirmaNo,
        KalkisNoktaID: requestDto.KalkisNoktaID,
        VarisNoktaID: requestDto.VarisNoktaID,
        Tarih: requestDto.Tarih,
        AraNoktaGelsin: requestDto.AraNoktaGelsin ? 1 : 0,
        IslemTipi: requestDto.IslemTipi,
        YolcuSayisi: requestDto.YolcuSayisi,
        Ip: requestDto.Ip,
      },
    };
    const xml = builder.buildObject(requestDocument);
    return this.run(xml);
  }

  async busSearch(requestDto: BusSearchRequestDto): Promise<any> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      Otobus: {
        $: {
          xmlns: '',
        },
        FirmaNo: requestDto.FirmaNo,
        KalkisNoktaID: requestDto.KalkisNoktaID,
        VarisNoktaID: requestDto.VarisNoktaID,
        Tarih: requestDto.Tarih,
        Saat: requestDto.Saat,
        HatNo: requestDto.HatNo,
        IslemTipi: requestDto.IslemTipi,
        YolcuSayisi: requestDto.YolcuSayisi,
        SeferTakipNo: requestDto.SeferTakipNo,
        Ip: requestDto.Ip,
      },
    };
    const xml = builder.buildObject(requestDocument);
    return this.run(xml);
  }

  async busSeatControl(requestDto: BusSeatControlRequestDto): Promise<any> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      OtobusKoltukKontrol: {
        $: {
          xmlns: '',
        },
        FirmaNo: requestDto.FirmaNo,
        KalkisNoktaID: requestDto.KalkisNoktaID,
        VarisNoktaID: requestDto.VarisNoktaID,
        Tarih: requestDto.Tarih,
        Saat: requestDto.Saat,
        HatNo: requestDto.HatNo,
        IslemTipi: requestDto.IslemTipi,
        SeferTakipNo: requestDto.SeferTakipNo,
        Ip: requestDto.Ip,
        Koltuklar: {
          $: {
            xmlns: '',
          },
          Koltuk: requestDto.Koltuklar.map((koltuk) => ({
            $: {
              xmlns: '',
            },
            KoltukNo: koltuk.KoltukNo,
            Cinsiyet: koltuk.Cinsiyet,
          })),
        },
      },
    };
    const xml = builder.buildObject(requestDocument);
    return this.run(xml);
  }

  async boardingPoint(requestDto: BoardingPointRequestDto): Promise<any> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      BinecegiYer: {
        $: {
          xmlns: '',
        },
        FirmaNo: requestDto.FirmaNo,
        KalkisNoktaID: requestDto.KalkisNoktaID,
        YerelSaat: requestDto.YerelSaat,
        HatNo: requestDto.HatNo,
      },
    };
    const xml = builder.buildObject(requestDocument);
    return this.run(xml);
  }

  async serviceInformation(
    requestDto: ServiceInformationRequestDto,
  ): Promise<any> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      Servis_2: {
        $: {
          xmlns: '',
        },
        FirmaNo: requestDto.FirmaNo,
        KalkisNoktaID: requestDto.KalkisNoktaID,
        YerelSaat: requestDto.YerelSaat,
        HatNo: requestDto.HatNo,
        Tarih: requestDto.Tarih,
        Saat: requestDto.Saat,
      },
    };
    const xml = builder.buildObject(requestDocument);
    return this.run(xml);
  }

  async saleRequest(requestDto: BusSaleRequestDto): Promise<any> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      IslemSatis: {
        $: {
          xmlns: '',
        },
        FirmaNo: requestDto.FirmaNo,
        KalkisNoktaID: requestDto.KalkisNoktaID,
        VarisNoktaID: requestDto.VarisNoktaID,
        Tarih: new Date(requestDto.Tarih).toISOString(),
        Saat: new Date(requestDto.Saat).toISOString(),
        HatNo: requestDto.HatNo,
        SeferNo: requestDto.SeferNo,
        TelefonNo: requestDto.TelefonNo,
        Cinsiyet: requestDto.Cinsiyet,
        ToplamBiletFiyati: requestDto.ToplamBiletFiyati,
        YolcuSayisi: requestDto.Passengers.length,
        BiletSeriNo: requestDto.BiletSeriNo,
        OdemeSekli: requestDto.OdemeSekli,
        FirmaAciklama: requestDto.FirmaAciklama,
        HatirlaticiNot: requestDto.HatirlaticiNot,
        SeyahatTipi: requestDto.SeyahatTipi,
        ...requestDto.Passengers.reduce((acc, passenger, index) => {
          acc[`KoltukNo${index + 1}`] = passenger.KoltukNo;
          acc[`Adi${index + 1}`] = passenger.Adi;
          acc[`Soyadi${index + 1}`] = passenger.Soyadi;
          acc[`Cinsiyet${index + 1}`] = passenger.Cinsiyet;
          acc[`TcVatandasiMi${index + 1}`] = passenger.TcVatandasiMi;
          acc[`TcKimlikNo${index + 1}`] = passenger.TcKimlikNo;
          acc[`PasaportUlkeKod${index + 1}`] = passenger.PasaportUlkeKod;
          acc[`PasaportNo${index + 1}`] = passenger.PasaportNo;
          if (passenger.BinecegiYer)
            acc[`BinecegiYer${index + 1}`] = passenger.BinecegiYer;
          if (passenger.ServisYeriKalkis)
            acc[`ServisYeriKalkis${index + 1}`] = passenger.ServisYeriKalkis;
          if (passenger.ServisYeriVaris)
            acc[`ServisYeriVaris${index + 1}`] = passenger.ServisYeriVaris;
          return acc;
        }, {}),
        WebYolcu: {
          $: {
            xmlns: '',
          },
          WebUyeNo: requestDto.WebYolcu.WebUyeNo,
          Ip: requestDto.WebYolcu.Ip,
          Email: requestDto.WebYolcu.Email,
          ...(requestDto.WebYolcu.KrediKartNo && {
            KrediKartNo: requestDto.WebYolcu.KrediKartNo,
            KrediKartSahip: requestDto.WebYolcu.KrediKartSahip,
            KrediKartGecerlilikTarihi:
              requestDto.WebYolcu.KrediKartGecerlilikTarihi,
            KrediKartCCV2: requestDto.WebYolcu.KrediKartCCV2,
          }),
          ...(requestDto.WebYolcu.OnOdemeKullan && {
            OnOdemeKullan: requestDto.WebYolcu.OnOdemeKullan,
            OnOdemeTutar: requestDto.WebYolcu.OnOdemeTutar,
          }),
          ...(requestDto.WebYolcu.AcikPnrNo && {
            AcikPnrNo: requestDto.WebYolcu.AcikPnrNo,
            AcikPnrSoyad: requestDto.WebYolcu.AcikPnrSoyad,
          }),
          ...(requestDto.WebYolcu.AcikTutar && {
            AcikTutar: requestDto.WebYolcu.AcikTutar,
          }),
          ...(requestDto.WebYolcu.RezervePnrNo && {
            RezervePnrNo: requestDto.WebYolcu.RezervePnrNo,
          }),
        },
      },
    };
    const xml = builder.buildObject(requestDocument);
    return this.run(xml);
  }

  async getRoute(requestDto: BusRouteRequestDto): Promise<any> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      Hat: {
        $: {
          xmlns: '',
        },
        FirmaNo: requestDto.FirmaNo,
        HatNo: requestDto.HatNo,
        KalkisNoktaID: requestDto.KalkisNoktaID,
        VarisNoktaID: requestDto.VarisNoktaID,
        BilgiIslemAdi: requestDto.BilgiIslemAdi,
        SeferTakipNo: requestDto.SeferTakipNo,
        Tarih: requestDto.Tarih,
      },
    };
    const xml = builder.buildObject(requestDocument);
    return this.run(xml);
  }
}
