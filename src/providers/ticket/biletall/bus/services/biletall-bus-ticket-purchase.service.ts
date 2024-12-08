import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';
import * as dayjs from 'dayjs';

// entites
import { Order } from '@app/modules/orders/order.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { BusTicket } from '@app/modules/tickets/bus/entities/bus-ticket.entity';

// services
import { BiletAllRequestService } from '../../services/biletall-request.service';
import { BiletAllBusTicketPurchaseParserService } from '../parsers/biletall-bus-ticket-purchase.parser.service';

// dtos
import { BankCardDto } from '@app/common/dtos';
import { BusTicketPurchaseDto } from '../dto/bus-ticket-purchase.dto';

// types
import { BusTicketPurchaseRequestResponse } from '../types/biletall-bus-ticket-purchase.type';

// helpers
import { BiletAllGender } from '../../helpers/biletall-gender.helper';

// utils
import { turkishToEnglish } from '@app/common/utils';

@Injectable()
export class BiletAllBusTicketPurchaseService {
  constructor(
    private readonly biletAllRequestService: BiletAllRequestService,
    private readonly biletAllBusTicketPurchaseParserService: BiletAllBusTicketPurchaseParserService,
  ) {}

  async purchaseTicket(
    clientIp: string,
    transaction: Transaction,
    order: Order,
    tickets: BusTicket[],
    bankCard: BankCardDto,
  ): Promise<string>;

  async purchaseTicket(
    clientIp: string,
    transaction: Transaction,
    order: Order,
    tickets: BusTicket[],
    bankCard?: undefined,
  ): Promise<BusTicketPurchaseDto>;

  async purchaseTicket(
    clientIp: string,
    transaction: Transaction,
    order: Order,
    tickets: BusTicket[],
    bankCard?: BankCardDto,
  ): Promise<BusTicketPurchaseDto | string> {
    const builder = new xml2js.Builder({
      headless: true,
      renderOpts: { pretty: false },
    });
    const {
      companyNumber,
      routeNumber,
      tripTrackingNumber,
      departureTerminal,
      arrivalTerminal,
      travelStartDateTime,
    } = tickets[0];
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
        TelefonNo: order.userPhoneNumber,
        ToplamBiletFiyati: transaction.amount, // with 2 precision -> 150.00
        YolcuSayisi: tickets.length,
        BiletSeriNo: 1, // constant
        OdemeSekli: 0, // constant
        SeyahatTipi: 0, // constant
        WebYolcu: {
          WebUyeNo: 0, // constant
          Ip: clientIp,
          Email: order.userEmail,
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
      await this.biletAllRequestService.run<BusTicketPurchaseRequestResponse>(
        xml,
      );
    return this.biletAllBusTicketPurchaseParserService.parsePurchaseRequest(
      res,
    );
  }
}
