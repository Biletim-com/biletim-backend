import { Module } from '@nestjs/common';

// providers
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

// services
import { InvoicesService } from './invoices.service';

// entites
import { Invoice } from './invoice.entity';

@Module({
  imports: [PostgreSQLProviderModule.forFeature([Invoice])],
  providers: [InvoicesService],
})
export class InvoicesModule {}
