import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '@app/common/database/postgresql/abstract.repository';
import { InvoiceAddress } from './invoice-address.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class InvoiceAddressRepository extends AbstractRepository<InvoiceAddress> {
  constructor(private dataSource: DataSource) {
    super(InvoiceAddress, dataSource.createEntityManager());
  }
}
