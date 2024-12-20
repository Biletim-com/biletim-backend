import { Injectable } from '@nestjs/common';

// services
import { PdfMakerService } from '@app/providers/pdf-maker/provider.service';
import { HtmlTemplateService } from '@app/providers/html-template/provider.service';
import { EventEmitterService } from '@app/providers/event-emitter/provider.service';
import { PlaneTicketOutputHandlerHelper } from '../helpers/plane-ticket-output-handler.helper';

// entites
import { PlaneTicketOrder } from '@app/modules/orders/plane-ticket/entities/plane-ticket-order.entity';

// decorators
import { OnEvent } from '@app/providers/event-emitter/decorators';

// types
import { PlaneTicketEmailTemplateData } from '@app/common/types';

@Injectable()
export class PlaneTicketOutputHandlerService {
  constructor(
    private readonly pdfMakerService: PdfMakerService,
    private readonly htmlTemplateService: HtmlTemplateService,
    private readonly eventEmitterService: EventEmitterService,
  ) {}

  @OnEvent('ticket.plane.purchased')
  async handlePlaneTicketOutputGeneration(order: PlaneTicketOrder) {
    // compose the ticket(s) info
    order.tickets.sort((a, b) => a.ticketOrder - b.ticketOrder);
    order.segments.sort((a, b) => a.segmentOrder - b.segmentOrder);

    const ticketTemplateData: PlaneTicketEmailTemplateData = {
      passengers: PlaneTicketOutputHandlerHelper.mapPassengers(
        order.tickets,
        order.pnr as string,
      ),
      airlineCompany: order.segments[0].airlineName,
      pnrNumber: order.pnr as string,
      importantNote: 'Bagajınızda sıvı kısıtlamalarına dikkat ediniz.',
      departureFlights: PlaneTicketOutputHandlerHelper.mapSegments(
        order.segments,
        order.pnr as string,
        false,
      ),
      returnFlights: PlaneTicketOutputHandlerHelper.mapSegments(
        order.segments,
        order.pnr as string,
        true,
      ),
    };

    const planeTicketHtml = await this.htmlTemplateService.renderTemplate(
      'plane-ticket',
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
