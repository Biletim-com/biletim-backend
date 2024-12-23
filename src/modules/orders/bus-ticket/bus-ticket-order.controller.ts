import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BusTicketOrderService } from './bus-ticket-order.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { CurrentUser } from '@app/common/decorators';
import { User } from '@app/modules/users/user.entity';
import { BusTicketOrder } from './entities/bus-ticket-order.entity';

@ApiTags('Bus-Ticket-Order')
@ApiCookieAuth()
@Controller('bus-ticket-order')
export class BusTicketOrderController {
  constructor(private readonly busTicketOrderService: BusTicketOrderService) {}

  @ApiOperation({ summary: 'Get Bus Travels Of User ' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getBusTravelsOfUser(
    @CurrentUser() user: User,
  ): Promise<BusTicketOrder[] | BusTicketOrder> {
    return this.busTicketOrderService.getBusTravelsOfUser(user.id);
  }
}
