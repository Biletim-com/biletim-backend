import { Injectable } from '@nestjs/common';
import { InvoiceAddressRepository } from './invoice-address.repository';
import { InvoiceAddress } from './invoice-address.entity';
import { UUID } from '@app/common/types';
import { InvoiceAddressDto } from './dto/invoice-address.dto';
import { InvoiceAddressNotFoundError } from '@app/common/errors/service/invoice-address.error';

@Injectable()
export class InvoiceAddressService {
  constructor(
    private readonly invoiceAddressRepository: InvoiceAddressRepository,
  ) {}

  private async findOneInvoice(
    invoiceId: UUID,
    userId: UUID,
  ): Promise<InvoiceAddress> {
    const invoiceAddress = await this.invoiceAddressRepository.findOne({
      where: {
        id: invoiceId,
        user: { id: userId },
      },
      relations: ['user'],
      select: {
        user: {
          id: true,
          createdAt: true,
          updatedAt: true,
          name: true,
          familyName: true,
          email: true,
          phone: true,
          address: true,
          isDeleted: true,
        },
      },
    });

    if (!invoiceAddress) {
      throw new InvoiceAddressNotFoundError();
    }
    return invoiceAddress;
  }

  async createInvoice(
    dto: InvoiceAddressDto,
    userId: UUID,
  ): Promise<InvoiceAddress> {
    const invoiceAddress = this.invoiceAddressRepository.create({
      ...dto,
      user: { id: userId },
    });

    return this.invoiceAddressRepository.save(invoiceAddress);
  }

  async findAllInvoices(
    userId: UUID,
    offset?: number,
    limit?: number,
  ): Promise<{
    invoices: InvoiceAddress[] | InvoiceAddress;
    totalCount: number;
  }> {
    const invoices = await this.invoiceAddressRepository.find({
      where: { user: { id: userId } },
      order: {
        createdAt: 'DESC',
      },
    });
    const totalCount = invoices.length;
    const startIndex = Math.min(offset || 0, totalCount);
    const endIndex = limit
      ? Math.min(startIndex + limit, totalCount)
      : totalCount;

    if (startIndex >= totalCount || startIndex < 0 || (limit && limit <= 0)) {
      return {
        invoices: [],
        totalCount,
      };
    }

    const slicedInvoices = invoices.slice(startIndex, endIndex);

    if (slicedInvoices.length === 1) {
      return {
        invoices: slicedInvoices[0],
        totalCount,
      };
    }

    return {
      invoices: slicedInvoices,
      totalCount,
    };
  }

  async updateInvoice(
    invoiceId: UUID,
    userId: UUID,
    dto: InvoiceAddressDto,
  ): Promise<{ message: string; statusCode: number }> {
    const invoiceAddress = await this.findOneInvoice(invoiceId, userId);

    await this.invoiceAddressRepository.update(invoiceAddress?.id, {
      ...dto,
    });

    return {
      message: 'Invoice updated successfully',
      statusCode: 200,
    };
  }

  async deleteInvoice(
    invoiceId: UUID,
    userId: UUID,
  ): Promise<{ message: string; statusCode: number }> {
    const invoiceAddress = await this.findOneInvoice(invoiceId, userId);

    await this.invoiceAddressRepository.delete(invoiceAddress.id);
    return {
      message: 'Invoice deleted successfully',
      statusCode: 200,
    };
  }
}
