import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { CurrentUser } from '@app/common/decorators';
import { User } from '@app/modules/users/user.entity';
import { PlaneTicketOrderService } from './plane-ticket-order.service';
import { PlaneTicketOrder } from './entities/plane-ticket-order.entity';

@ApiTags('Plane-Ticket-Order')
@ApiCookieAuth()
@Controller('plane-ticket-order')
export class PlaneTicketOrderController {
  constructor(
    private readonly planeTicketOrderService: PlaneTicketOrderService,
  ) {}

  @ApiOperation({ summary: 'Get Plane Travels Of User' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getPlaneTravelsOfUser(
    @CurrentUser() user: User,
  ): Promise<PlaneTicketOrder[] | PlaneTicketOrder> {
    return this.planeTicketOrderService.getPlaneTravelsOfUser(user.id);
  }
}
