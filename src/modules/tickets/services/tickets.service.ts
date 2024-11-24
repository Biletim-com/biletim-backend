import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';

// services
import { PdfMakerService } from '@app/providers/pdf-maker/provider.service';
import { HtmlTemplateService } from '@app/providers/html-template/provider.service';
import { EventEmitterService } from '@app/providers/event-emitter/provider.service';

// entites
import { Order } from '@app/modules/orders/order.entity';

// decorators
import { OnEvent } from '@app/providers/event-emitter/decorators';

// types
import {
  BusTicketEmailTemplateData,
  PlaneTicketEmailTemplateData,
} from '@app/common/types';

@Injectable()
export class TicketsService {
  constructor(
    private readonly pdfMakerService: PdfMakerService,
    private readonly htmlTemplateService: HtmlTemplateService,
    private readonly eventEmitterService: EventEmitterService,
  ) {}

  @OnEvent('ticket.bus.purchased')
  async handleBusTicketOutputGeneration(order: Order) {
    // compose the ticket(s) info
    order.busTickets.sort((a, b) => a.ticketOrder - b.ticketOrder);
    const ticketTemplateData: BusTicketEmailTemplateData = {
      pnrNumber: order.pnr as string,
      trip: {
        busCompany: order.busTickets[0].companyName,
        departureTerminal: order.busTickets[0].departureTerminal.name,
        arrivalTerminal: order.busTickets[0].arrivalTerminal.name,
        departureDate: dayjs(order.busTickets[0].travelStartDateTime).format(
          'DD.MM.YYYY',
        ),
        departureTime: (() => {
          const utcDateTime = `${
            order.busTickets[0].travelStartDateTime.split('+')[0]
          }Z`;
          return dayjs(utcDateTime).format('HH:mm');
        })(),
      },
      passengers: order.busTickets.map(
        ({ passenger, seatNumber, ticketPrice }) => ({
          passengerFullName: `${passenger.firstName} ${passenger.lastName}`,
          amount: ticketPrice,
          gender: passenger.gender,
          pnrNumber: order.pnr as string,
          seatNumber: seatNumber,
          tcNumber: passenger.tcNumber as string,
        }),
      ),
    };

    const planeTicketHtml = await this.htmlTemplateService.renderTemplate(
      'first-page',
      ticketTemplateData,
    );
    const ticketBuffer = await this.pdfMakerService.createPdf(planeTicketHtml);

    /**
     * We might need to save the genearted pdf to a bucket
     */

    this.eventEmitterService.emitEvent('ticket.bus.generated', {
      recipient: order.userEmail,
      attachments: [
        {
          filename: 'your-bus-ticket.pdf',
          content: Buffer.from(ticketBuffer),
          contentType: 'application/pdf',
        },
      ],
      ticketTemplateData,
    });
  }

  @OnEvent('ticket.plane.purchased')
  async handlePlaneTicketOutputGeneration(order: Order) {
    // compose the ticket(s) info
    order.planeTickets.sort((a, b) => a.ticketOrder - b.ticketOrder);
    order.planeTickets.forEach((planeTicket) =>
      planeTicket.segments.sort((a, b) => a.segmentOrder - b.segmentOrder),
    );
    const ticketTemplateData: PlaneTicketEmailTemplateData = {
      passengers: order.planeTickets.map(({ ticketNumber, passenger }) => ({
        passengerFullName: `${passenger.firstName} ${passenger.lastName}`,
        pnrNumber: order.pnr as string,
        ticketNumber: ticketNumber as string,
      })),
      airlineCompany: order.planeTickets[0].segments[0].airlineName,
      pnrNumber: order.pnr as string,
      importantNote: 'Bagajınızda sıvı kısıtlamalarına dikkat ediniz.',
      departureFlights: order.planeTickets[0].segments
        .filter((segment) => segment.isReturnFlight === false)
        .map((segment) => ({
          airlineCompany: segment.airlineName,
          departureAirport: `${segment.departureAirport.airportNameEn} (${segment.departureAirport.airportCode})`,
          arrivalAirport: `${segment.arrivalAirport.airportNameEn} (${segment.arrivalAirport.airportCode})`,
          flightNumber: segment.flightNumber,
          flightClassType: segment.flightFareDetails.flightClassType,
          flightClassName: segment.flightFareDetails.flightClassName,
          luggageAllowance: segment.flightFareDetails.luggage,
          cabinLuggageAllowance: segment.flightFareDetails.cabinLuggage,
          luggageAllowanceDetails: 'Ekstra bagaj ücreti uygulanabilir.',
          departureDateTime: segment.departureDateTime,
          arrivalDateTime: segment.arrivalDateTime,
          flightDuration: (() => {
            const departureDate = new Date(segment.departureDateTime);
            const arrivalDate = new Date(segment.arrivalDateTime);
            const diffDate = new Date(
              arrivalDate.getTime() - departureDate.getTime(),
            );
            const hours = diffDate.getHours();
            const minutes = diffDate.getMinutes();
            return `${hours} saat${minutes !== 0 ? ` ${minutes} dakika` : ''}`;
          })(),
          pnrNumber: order.pnr as string,
        })),
      returnFlights: order.planeTickets[0].segments
        .filter((segment) => segment.isReturnFlight === true)
        .map((segment) => ({
          airlineCompany: segment.airlineName,
          departureAirport: `${segment.departureAirport.airportNameEn} (${segment.departureAirport.airportCode})`,
          arrivalAirport: `${segment.arrivalAirport.airportNameEn} (${segment.arrivalAirport.airportCode})`,
          flightNumber: segment.flightNumber,
          flightClassType: segment.flightFareDetails.flightClassType,
          flightClassName: segment.flightFareDetails.flightClassName,
          luggageAllowance: segment.flightFareDetails.luggage,
          cabinLuggageAllowance: segment.flightFareDetails.cabinLuggage,
          luggageAllowanceDetails: 'Ekstra bagaj ücreti uygulanabilir.',
          departureDateTime: segment.departureDateTime,
          arrivalDateTime: segment.arrivalDateTime,
          flightDuration: (() => {
            const departureDate = new Date(segment.departureDateTime);
            const arrivalDate = new Date(segment.arrivalDateTime);
            const diffDate = new Date(
              arrivalDate.getTime() - departureDate.getTime(),
            );
            const hours = diffDate.getHours();
            const minutes = diffDate.getMinutes();
            return `${hours} saat${minutes !== 0 ? ` ${minutes} dakika` : ''}`;
          })(),
          pnrNumber: order.pnr as string,
        })),
    };

    const planeTicketHtml = await this.htmlTemplateService.renderTemplate(
      'first-page',
      ticketTemplateData,
    );
    const ticketBuffer = await this.pdfMakerService.createPdf(planeTicketHtml);

    /**
     * We might need to save the genearted pdf to a bucket
     */

    this.eventEmitterService.emitEvent('ticket.plane.generated', {
      recipient: order.userEmail,
      attachments: [
        {
          filename: 'your-plane-ticket.pdf',
          content: Buffer.from(ticketBuffer),
          contentType: 'application/pdf',
        },
      ],
      ticketTemplateData,
    });
  }
}
