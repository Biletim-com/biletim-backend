import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InvoiceAddressService } from './invoice-address.service';
import { InvoiceAddress } from './invoice-address.entity';
import { User } from '../user.entity';
import { CurrentUser } from '@app/common/decorators';
import { JwtAuthGuard } from '@app/common/guards';
import { InvoiceAddressDto } from './dto/invoice-address.dto';
import { UUID } from '@app/common/types';
import { InvoiceQueryDto } from './dto/invoice-query.dto';

@ApiTags('Invoice-Address')
@ApiCookieAuth()
@Controller('invoice-address')
export class InvoiceAddressController {
  constructor(private readonly invoiceAddressService: InvoiceAddressService) {}

  @ApiOperation({ summary: 'Create Invoice' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createInvoice(
    @Body() dto: InvoiceAddressDto,
    @CurrentUser() user: User,
  ): Promise<InvoiceAddress> {
    return this.invoiceAddressService.createInvoice(dto, user.id);
  }

  @ApiOperation({ summary: 'Get Invoices Of User' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllInvoices(
    @CurrentUser() user: User,
    @Query() queryDto: InvoiceQueryDto,
  ): Promise<{
    invoices: InvoiceAddress[] | InvoiceAddress;
    totalCount: number;
  }> {
    const invoices = await this.invoiceAddressService.findAllInvoices(
      user.id,
      queryDto.offset ? parseInt(queryDto.offset, 10) : undefined,
      queryDto.limit ? parseInt(queryDto.limit, 10) : undefined,
    );
    return invoices;
  }

  @ApiOperation({ summary: 'Update Invoice ' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') invoiceId: UUID,
    @CurrentUser() user: User,
    @Body() dto: InvoiceAddressDto,
  ): Promise<{ message: string; statusCode: number }> {
    return this.invoiceAddressService.updateInvoice(invoiceId, user.id, dto);
  }

  @ApiOperation({ summary: 'Delete Invoice ' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteInvoice(
    @Param('id') invoiceId: UUID,
    @CurrentUser() user: User,
  ): Promise<{ message: string; statusCode: number }> {
    return this.invoiceAddressService.deleteInvoice(invoiceId, user.id);
  }
}
