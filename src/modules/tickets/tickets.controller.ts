import { Controller, Query, Get, NotFoundException } from '@nestjs/common';

import { PlaneTicketOutputHandlerService } from './services/plane-ticket-output-handler.service';
import { PlaneTicketOrdersRepository } from '../orders/plane-ticket/plane-ticket-orders.repository';
import { UUID } from '@app/common/types';

@Controller('ticket-generate')
export class TicketController {
  constructor(
    private readonly planeTicketOutputHandlerService: PlaneTicketOutputHandlerService,
    private readonly planeTicketOrdersRepository: PlaneTicketOrdersRepository,
  ) {}

  @Get('generate')
  async generateTicketOutput(@Query('id') id: UUID) {
    const order = await this.planeTicketOrdersRepository.findOne({
      where: { id },
      relations: {
        transaction: true,
        segments: {
          arrivalAirport: true,
          departureAirport: true,
        },
        tickets: {
          passenger: true,
        },
      },
      select: {
        transaction: {
          paymentProvider: true,
        },
      },
    });
    if (!order) {
      throw new NotFoundException();
    }

    this.planeTicketOutputHandlerService.handlePlaneTicketOutputGeneration(
      order,
    );
  }
}
