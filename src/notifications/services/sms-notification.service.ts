import { Injectable, Logger } from '@nestjs/common';

import { OnEvent } from '@app/providers/event-emitter/decorators';

import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QueueEnum } from '@app/common/enums';
import { Order } from '@app/modules/orders/order.entity';
import { DateTimeHelper } from '@app/common/helpers';
import {
  SMSBusMessage,
  SMSPlaneMessage,
} from '../types/send-notifications-options.type';
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
  async sendBusTicketSMS(order: Order): Promise<void> {
    order.busTickets.sort((a, b) => a.ticketOrder - b.ticketOrder);
    const ticketData: SMSBusMessage = {
      userPhoneNumber: order.userPhoneNumber,
      pnrNumber: order.pnr as string,
      busCompany: order.busTickets[0].companyName,
      departureTerminal: order.busTickets[0].departureTerminal.name,
      arrivalTerminal: order.busTickets[0].arrivalTerminal.name,
      departureDate: DateTimeHelper.extractDate(
        order.busTickets[0].travelStartDateTime,
      ),
      departureTime: DateTimeHelper.extractTime(
        order.busTickets[0].travelStartDateTime,
      ),
      seatNumber: order.busTickets[0].seatNumber,
    };

    await this.queue.add({
      gsmno: ticketData.userPhoneNumber,
      messsage: `${ticketData.busCompany} Biletiniz: ${ticketData.departureTerminal} – ${ticketData.arrivalTerminal} Sefer Tarihi: ${ticketData.departureDate} ${ticketData.departureTime} Koltuk: ${ticketData.seatNumber} PNR: ${ticketData.pnrNumber}`,
    });
  }

  @OnEvent('ticket.plane.purchased')
  async sendPlaneTicketSMS(order: Order): Promise<void> {
    order.planeTickets.sort((a, b) => a.ticketOrder - b.ticketOrder);
    const ticketData: SMSPlaneMessage = {
      pnrNumber: order.pnr as string,
      userPhoneNumber: order.userPhoneNumber,
      airlineName: order.planeTickets[0].segments[0].airlineName,
      departureAirport:
        order.planeTickets[0].segments[0].departureAirport.airportName,
      arrivalAirport:
        order.planeTickets[0].segments[0].arrivalAirport.airportName,
      departureDate: DateTimeHelper.extractDate(
        order.planeTickets[0].segments[0].departureDateTime,
      ),
      departureTime: DateTimeHelper.extractTime(
        order.planeTickets[0].segments[0].departureDateTime,
      ),
      arrivalDate: DateTimeHelper.extractDate(
        order.planeTickets[0].segments[0].departureDateTime,
      ),
      arrivalTime: DateTimeHelper.extractTime(
        order.planeTickets[0].segments[0].departureDateTime,
      ),
      flightNumber: order.planeTickets[0].segments[0].flightNumber,
    };

    await this.queue.add({
      gsmno: ticketData.userPhoneNumber,
      messsage: `${ticketData.airlineName} ${ticketData.flightNumber} Biletiniz: ${ticketData.departureAirport} – ${ticketData.arrivalAirport} Uçuş Tarihi: ${ticketData.departureDate} ${ticketData.departureTime} PNR: ${ticketData.pnrNumber}`,
    });
  }
}
