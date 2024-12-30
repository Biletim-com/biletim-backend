import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

// entites
import { OnEvent } from '@app/providers/event-emitter/decorators';
import { BusTicketOrder } from '@app/modules/orders/bus-ticket/entities/bus-ticket-order.entity';
import { PlaneTicketOrder } from '@app/modules/orders/plane-ticket/entities/plane-ticket-order.entity';

// enu,s
import { QueueEnum } from '@app/common/enums';

// helpers
import { DateTimeHelper } from '@app/common/helpers';

// types
import {
  SMSBusMessage,
  SMSPlaneMessage,
} from '../types/send-notifications-options.type';

// dtos
import { SendOrderCancelInitSMSDto } from '@app/common/dtos';

@Injectable()
export class SMSNotificationService {
  private readonly logger = new Logger(SMSNotificationService.name);

  constructor(
    @InjectQueue(QueueEnum.SMS_QUEUE)
    private readonly queue: Queue,
  ) {}

  @OnEvent('order.cancel.init')
  async sendOrderCancelInitSMS({
    verificationCode,
    gsmno,
  }: SendOrderCancelInitSMSDto): Promise<void> {
    verificationCode;
    await this.queue.add({
      messsage: `Doğrulama Kodu: ${verificationCode} `,
      gsmno,
    });
  }

  @OnEvent('ticket.bus.purchased')
  async sendBusTicketSMS(order: BusTicketOrder): Promise<void> {
    order.tickets.sort((a, b) => a.ticketOrder - b.ticketOrder);
    const ticketData: SMSBusMessage = {
      userPhoneNumber: order.userPhoneNumber,
      pnrNumber: order.pnr as string,
      busCompany: order.companyName,
      departureTerminal: order.departureTerminal.name,
      arrivalTerminal: order.arrivalTerminal.name,
      departureDate: DateTimeHelper.extractDate(order.travelStartDateTime),
      departureTime: DateTimeHelper.extractTime(order.travelStartDateTime),
      seatNumber: order.tickets[0].seatNumber,
    };

    await this.queue.add({
      gsmno: ticketData.userPhoneNumber,
      messsage: `${ticketData.busCompany} Biletiniz: ${ticketData.departureTerminal} – ${ticketData.arrivalTerminal} Sefer Tarihi: ${ticketData.departureDate} ${ticketData.departureTime} Koltuk: ${ticketData.seatNumber} PNR: ${ticketData.pnrNumber}`,
    });
  }

  @OnEvent('ticket.plane.purchased')
  async sendPlaneTicketSMS(order: PlaneTicketOrder): Promise<void> {
    order.tickets.sort((a, b) => a.ticketOrder - b.ticketOrder);
    const ticketData: SMSPlaneMessage = {
      pnrNumber: order.pnr as string,
      userPhoneNumber: order.userPhoneNumber,
      airlineName: order.segments[0].airlineName,
      departureAirport: order.segments[0].departureAirport.airportName,
      arrivalAirport: order.segments[0].arrivalAirport.airportName,
      departureDate: DateTimeHelper.extractDate(
        order.segments[0].departureDateTime,
      ),
      departureTime: DateTimeHelper.extractTime(
        order.segments[0].departureDateTime,
      ),
      arrivalDate: DateTimeHelper.extractDate(
        order.segments[0].departureDateTime,
      ),
      arrivalTime: DateTimeHelper.extractTime(
        order.segments[0].departureDateTime,
      ),
      flightNumber: order.segments[0].flightNumber,
    };

    await this.queue.add({
      gsmno: ticketData.userPhoneNumber,
      messsage: `${ticketData.airlineName} ${ticketData.flightNumber} Biletiniz: ${ticketData.departureAirport} – ${ticketData.arrivalAirport} Uçuş Tarihi: ${ticketData.departureDate} ${ticketData.departureTime} PNR: ${ticketData.pnrNumber}`,
    });
  }
}
