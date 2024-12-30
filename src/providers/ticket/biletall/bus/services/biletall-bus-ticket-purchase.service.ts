import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';
import * as dayjs from 'dayjs';

// entites
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { BusTicketOrder } from '@app/modules/orders/bus-ticket/entities/bus-ticket-order.entity';
import { BusTicket } from '@app/modules/orders/bus-ticket/entities/bus-ticket.entity';

// services
import { TicketConfigService } from '@app/configs/ticket';
import { BiletAllRequestService } from '../../services/biletall-request.service';
import { BiletAllBusTicketPurchaseParserService } from '../parsers/biletall-bus-ticket-purchase.parser.service';

// dtos
import { BankCardDto } from '@app/common/dtos';
import { BusTicketPurchaseResultDto } from '../dto/bus-ticket-purchase-result.dto';

// types
import { BusTicketPurchaseResultResponse } from '../types/biletall-bus-ticket-purchase-result.type';

// helpers
import { BiletAllGender } from '../../helpers/biletall-gender.helper';

// utils
import { turkishToEnglish } from '@app/common/utils';

@Injectable()
export class BiletAllBusTicketPurchaseService {
  private readonly biletAllRequestService: BiletAllRequestService;
  constructor(
    ticketConfigService: TicketConfigService,
    private readonly biletAllBusTicketPurchaseParserService: BiletAllBusTicketPurchaseParserService,
  ) {
    this.biletAllRequestService = new BiletAllRequestService(
      ticketConfigService.biletAllBaseUrl,
      ticketConfigService.biletAllUsername,
      ticketConfigService.biletAllPassword,
    );
  }

  async purchaseTicket(
    clientIp: string,
    transaction: Transaction,
    order: BusTicketOrder,
    tickets: BusTicket[],
    bankCard: BankCardDto,
  ): Promise<string>;

  async purchaseTicket(
    clientIp: string,
    transaction: Transaction,
    order: BusTicketOrder,
    tickets: BusTicket[],
    bankCard?: undefined,
  ): Promise<BusTicketPurchaseResultDto>;

  async purchaseTicket(
    clientIp: string,
    transaction: Transaction,
    order: BusTicketOrder,
    tickets: BusTicket[],
    bankCard?: BankCardDto,
  ): Promise<BusTicketPurchaseResultDto | string> {
    const builder = new xml2js.Builder({
      headless: true,
      renderOpts: { pretty: false },
    });
    const {
      userPhoneNumber,
      userEmail,
      companyNumber,
      routeNumber,
      tripTrackingNumber,
      departureTerminal,
      arrivalTerminal,
      travelStartDateTime,
    } = order;
    const date = dayjs(travelStartDateTime).format('YYYY-MM-DD');

    const requestDocument = {
      IslemSatis: {
        FirmaNo: companyNumber,
        KalkisNoktaID: departureTerminal.externalId,
        VarisNoktaID: arrivalTerminal.externalId,
        Tarih: date,
        Saat: travelStartDateTime,
        HatNo: routeNumber,
        SeferNo: tripTrackingNumber,
        KalkisTerminalAdiSaatleri: '',
        ...tickets.reduce((acc, ticket, index) => {
          acc[`KoltukNo${index + 1}`] = ticket.seatNumber;
          acc[`Adi${index + 1}`] = turkishToEnglish(ticket.passenger.firstName);
          acc[`Soyadi${index + 1}`] = turkishToEnglish(
            ticket.passenger.lastName,
          );
          acc[`Cinsiyet${index + 1}`] = BiletAllGender[ticket.passenger.gender];
          acc[`TcVatandasiMi${index + 1}`] = ticket.passenger.tcNumber ? 1 : 0;

          if (ticket.passenger.tcNumber) {
            acc[`TcKimlikNo${index + 1}`] = ticket.passenger.tcNumber;
          } else {
            acc[`PasaportUlkeKod${index + 1}`] =
              ticket.passenger.passportCountryCode;
            acc[`PasaportNo${index + 1}`] = ticket.passenger.passportNumber;
          }
          return acc;
        }, {}),
        TelefonNo: userPhoneNumber,
        ToplamBiletFiyati: transaction.amount, // with 2 precision -> 150.00
        YolcuSayisi: tickets.length,
        BiletSeriNo: 1, // constant
        OdemeSekli: 0, // constant
        SeyahatTipi: 0, // constant
        WebYolcu: {
          WebUyeNo: 0, // constant
          Ip: clientIp,
          Email: userEmail,
          // if credit card passed this means we purchase via biletall
          ...(bankCard?.pan
            ? {
                KrediKartNo: bankCard.pan,
                KrediKartSahip: bankCard.holderName,
                KrediKartGecerlilikTarihi: dayjs(bankCard.expiryDate).format(
                  'MM.YYYY',
                ),
                KrediKartCCV2: bankCard.cvv,
              }
            : {
                OnOdemeKullan: 1,
                OnOdemeTutar: transaction.amount,
              }),
        },
      },
    };

    const xml = builder.buildObject(requestDocument);
    if (bankCard) return xml;

    const res =
      await this.biletAllRequestService.run<BusTicketPurchaseResultResponse>(
        xml,
      );
    return this.biletAllBusTicketPurchaseParserService.parsePurchaseRequest(
      res,
    );
  }
}
