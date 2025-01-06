import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { User } from '../user.entity';
import { InvoiceAddress } from './invoice-address.entity';
import { InvoiceAddressService } from './invoice-address.service';

// guards
import { JwtAuthGuard } from '@app/common/guards';

// decorators
import { CurrentUser } from '@app/common/decorators';

// dto
import { ListResponseDto } from '@app/common/dtos';
import { InvoiceQueryDto } from './dto/invoice-query.dto';
import { InvoiceAddressDto } from './dto/invoice-address.dto';

// types
import { UUID } from '@app/common/types';

@ApiTags('Invoice-Address')
@ApiCookieAuth()
@Controller('invoice-address')
export class InvoiceAddressController {
  constructor(private readonly invoiceAddressService: InvoiceAddressService) {}

  @ApiOperation({ summary: 'Get Invoice Addresses Of User' })
  @ApiQuery({ type: InvoiceQueryDto })
  @UseGuards(JwtAuthGuard)
  @Get()
  async listInvoices(
    @CurrentUser() user: User,
    @Query() queryDto: InvoiceQueryDto,
  ): Promise<ListResponseDto<InvoiceAddress>> {
    return this.invoiceAddressService.listInvoices(
      user.id,
      queryDto.take,
      queryDto.skip,
    );
  }

  @ApiOperation({ summary: 'Create Invoice Address' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createInvoice(
    @CurrentUser() user: User,
    @Body() dto: InvoiceAddressDto,
  ): Promise<InvoiceAddress> {
    return this.invoiceAddressService.createInvoice(user.id, dto);
  }

  @ApiOperation({ summary: 'Update Invoice Address' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id') invoiceId: UUID,
    @Body() dto: InvoiceAddressDto,
  ): Promise<{ message: string }> {
    await this.invoiceAddressService.updateInvoice(user.id, invoiceId, dto);
    return { message: 'Invoice updated successfully' };
  }

  @ApiOperation({ summary: 'Delete Invoice Address' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteInvoice(
    @CurrentUser() user: User,
    @Param('id') invoiceId: UUID,
  ): Promise<void> {
    return this.invoiceAddressService.deleteInvoice(user.id, invoiceId);
  }
}
