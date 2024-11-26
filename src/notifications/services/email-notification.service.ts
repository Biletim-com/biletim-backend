import { Injectable, Logger } from '@nestjs/common';

import { SendVerifyAccountEmailNotificationDto } from '@app/common/dtos/send-email-notification.dto';

import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QueueEnum } from '@app/common/enums';

import { AuthConfigService } from '@app/configs/auth';

// entites
import { Order } from '@app/modules/orders/order.entity';

// decorators
import { OnEvent, OnEvents } from '@app/providers/event-emitter/decorators';

// types
import {
  SendResetPasswordEmailNotification,
  SendPlaneTicketGeneratedEmailNotication,
  SendVerifyAccountEmailNotification,
  BusTicketEmailTemplateData,
} from '@app/common/types';

// enums
import { Gender } from '@app/common/enums';
import { DateTimeHelper } from '@app/common/helpers';

/**
 * Bus Ticket SMS message
 * Sn. KARASU; biletim.com adresimizden KAMİLKOÇ otobüs biletini başarıyla satın aldınız!
 * Manavgat Otogarı – Antalya Otogarı Sefer Tarihi: 19 Temmuz 2023 Saat: 14:30 Koltuk:28
 * PNR:1099065608. Mobil uygulamamızı indirin: (link) bilet bilgilerinize kolaylık erişin, İyi Yolculuklar.
 */

/**
 * Plane Ticket SMS message
 * Sn. KARASU ; biletim.com adresimizden 1AW7F. PNR Nolu 15.12.2024
 * Saat.09.05 SAW - ECN (AJet) / 18.12.2024 Saat.15.05 ECN - SAW (AJet) uçak biletinizi
 * başarıyla satın aldınız! Mobil uygulamamızı indirin: (link) uçuş bilgilerinize kolaylık erişin, İyi Yolculuklar.
 */

@Injectable()
export class EmailNotificationService {
  private readonly logger = new Logger(EmailNotificationService.name);

  constructor(
    @InjectQueue(QueueEnum.EMAIL_QUEUE)
    private readonly queue: Queue,
    private readonly authConfigService: AuthConfigService,
  ) {}

  @OnEvents(['user.created', 'user.email.updated'])
  async sendSetupProfileEmail({
    recipient,
    verificationCode,
  }: SendVerifyAccountEmailNotificationDto): Promise<void> {
    await this.queue.add({
      recipient: recipient,
      subject: 'Email Verification',
      options: {
        template: 'verify-email',
        context: {
          header: 'Email Verification',
          content: 'Verification code',
          verificationCode,
        },
      },
    });
  }

  @OnEvent('user.password.reset')
  async sendResetPasswordEmail({
    recipient,
    forgotPasswordCode,
  }: SendVerifyAccountEmailNotificationDto): Promise<void> {
    await this.queue.add({
      recipient: recipient,
      subject: 'Password reset',
      options: {
        template: 'reset-password',
        context: {
          header: 'Password reset',
          content: 'Click the button below to reset your password.',
          url: `${this.authConfigService.resetPasswordUrl}?verificationCode=${forgotPasswordCode}`,
        },
      },
    });
  }

  @OnEvent('ticket.bus.purchased')
  async sendBusTicketEmail(order: Order): Promise<void> {
    order.busTickets.sort((a, b) => a.ticketOrder - b.ticketOrder);
    const ticketTemplateData: BusTicketEmailTemplateData = {
      pnrNumber: order.pnr as string,
      trip: {
        busCompany: order.busTickets[0].companyName,
        departureTerminal: order.busTickets[0].departureTerminal.name,
        arrivalTerminal: order.busTickets[0].arrivalTerminal.name,
        departureDate: DateTimeHelper.extractDate(
          order.busTickets[0].travelStartDateTime,
        ),
        departureTime: DateTimeHelper.extractTime(
          order.busTickets[0].travelStartDateTime,
        ),
      },
      passengers: order.busTickets.map(
        ({ passenger, seatNumber, ticketPrice }) => ({
          passengerFullName: `${passenger.firstName} ${passenger.lastName}`,
          amount: ticketPrice,
          gender: passenger.gender === Gender.MALE ? 'Erkek' : 'Kadın',
          pnrNumber: order.pnr as string,
          seatNumber: seatNumber,
          tcNumber: passenger.tcNumber as string,
        }),
      ),
      companyLogo: `https://eticket.ipektr.com/wsbos3/LogoVer.Aspx?fnum=${order.busTickets[0].companyNumber}`,
    };

    await this.queue.add({
      recipient: order.userEmail,
      subject: `${ticketTemplateData.pnrNumber} PNR kodlu ${ticketTemplateData.trip.departureTerminal} – ${ticketTemplateData.trip.arrivalTerminal} online bilet bilgileri`,
      options: {
        template: 'bus-ticket-email-body',
        context: ticketTemplateData,
      },
    });
  }

  @OnEvent('ticket.plane.generated')
  async sendResetTicketEmail({
    recipient,
    ticketTemplateData,
    attachments,
  }: SendPlaneTicketGeneratedEmailNotication): Promise<void> {
    const departureAirportCity =
      ticketTemplateData.departureFlights[0].departureAirportCity;
    const arrivalAirportCity =
      ticketTemplateData.departureFlights[0].arrivalAirportCity;

    await this.queue.add({
      recipient: recipient,
      subject: `${ticketTemplateData.pnrNumber} PNR kodlu ${departureAirportCity} - ${arrivalAirportCity} uçuşunuzun bilgileri`,
      options: {
        template: 'plane-ticket-email-body',
        context: ticketTemplateData,
        attachments,
      },
    });
  }
}
