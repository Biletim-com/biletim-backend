import { Injectable } from '@nestjs/common';

// services
import { PdfMakerService } from '@app/providers/pdf-maker/provider.service';
import { HtmlTemplateService } from '@app/providers/html-template/provider.service';
import { EventEmitterService } from '@app/providers/event-emitter/provider.service';

// entites
import { Order } from '@app/modules/orders/order.entity';

// decorators
import { OnEvent } from '@app/providers/event-emitter/decorators';

@Injectable()
export class TicketsService {
  constructor(
    private readonly pdfMakerService: PdfMakerService,
    private readonly htmlTemplateService: HtmlTemplateService,
    private readonly eventEmitterService: EventEmitterService,
  ) {}

  @OnEvent('ticket.bus.purchased')
  async handleBusTicketOutputGeneration(order: Order) {
    const bustTickerHtmls = await Promise.all(
      order.busTickets.map((busTicket) =>
        this.htmlTemplateService.renderTemplate('first-page', busTicket),
      ),
    );
    const ticketBuffers = await Promise.all(
      bustTickerHtmls.map((bustTickerHtml) =>
        this.pdfMakerService.createPdf(bustTickerHtml),
      ),
    );

    console.log({ ticketBuffers });

    this.eventEmitterService.emitEvent('ticket.bus.generated', {
      recipient: order.userEmail,
      attachments: ticketBuffers.map((ticketBuffer) => {
        return {
          filename: 'ticket.pdf',
          content: ticketBuffer,
          contentType: 'application/pdf',
        };
      }),
    });
  }
}
