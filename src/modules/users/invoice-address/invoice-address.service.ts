import { Injectable } from '@nestjs/common';

import { InvoiceAddress } from './invoice-address.entity';
import { InvoiceAddressRepository } from './invoice-address.repository';

// dto
import { ListResponseDto } from '@app/common/dtos';
import { InvoiceAddressDto } from './dto/invoice-address.dto';

// types
import { UUID } from '@app/common/types';

// errors
import { InvoiceAddressNotFoundError } from '@app/common/errors';

@Injectable()
export class InvoiceAddressService {
  constructor(
    private readonly invoiceAddressRepository: InvoiceAddressRepository,
  ) {}

  private composeInvoiceAddress(invoiceDto: InvoiceAddressDto): InvoiceAddress {
    return new InvoiceAddress({
      type: invoiceDto.type,
      name: invoiceDto.name,
      identifier: invoiceDto.identifier,
      address: invoiceDto.address,
      taxOffice: invoiceDto.taxOffice,
    });
  }

  private async findOneInvoice(
    userId: UUID,
    invoiceId: UUID,
  ): Promise<InvoiceAddress> {
    const invoiceAddress = await this.invoiceAddressRepository.findOne({
      where: {
        id: invoiceId,
        user: { id: userId },
      },
    });

    if (!invoiceAddress) {
      throw new InvoiceAddressNotFoundError();
    }
    return invoiceAddress;
  }

  async listInvoices(
    userId: UUID,
    take: number,
    skip: number,
  ): Promise<ListResponseDto<InvoiceAddress>> {
    const [invoices, count] = await this.invoiceAddressRepository.findAndCount({
      where: { user: { id: userId } },
      order: {
        createdAt: 'DESC',
      },
      take,
      skip,
    });
    return { data: invoices, count };
  }

  async createInvoice(
    userId: UUID,
    dto: InvoiceAddressDto,
  ): Promise<InvoiceAddress> {
    const invoiceAddress = this.composeInvoiceAddress(dto);
    return this.invoiceAddressRepository.save({
      ...invoiceAddress,
      user: { id: userId },
    });
  }

  async updateInvoice(
    userId: UUID,
    invoiceId: UUID,
    dto: InvoiceAddressDto,
  ): Promise<void> {
    const invoiceAddressToUpdate = this.composeInvoiceAddress(dto);
    await this.findOneInvoice(userId, invoiceId);

    await this.invoiceAddressRepository.update(
      invoiceId,
      invoiceAddressToUpdate,
    );
  }

  async deleteInvoice(userId: UUID, invoiceId: UUID): Promise<void> {
    const invoiceAddress = await this.findOneInvoice(userId, invoiceId);
    await this.invoiceAddressRepository.delete(invoiceAddress.id);
  }
}
