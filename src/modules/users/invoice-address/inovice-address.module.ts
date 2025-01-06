import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { InvoiceAddressController } from './invoice-address.controller';
import { InvoiceAddressService } from './invoice-address.service';
import { InvoiceAddressRepository } from './invoice-address.repository';
import { InvoiceAddress } from './invoice-address.entity';

@Module({
  imports: [PostgreSQLProviderModule.forFeature([InvoiceAddress])],
  controllers: [InvoiceAddressController],
  providers: [InvoiceAddressService, InvoiceAddressRepository],
})
export class InvoiceAddressModule {}
