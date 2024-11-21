import { Global, Module } from '@nestjs/common';
import { PdfMakerService } from './provider.service';

@Global()
@Module({
  providers: [PdfMakerService],
  exports: [PdfMakerService],
})
export class PdfMakerModule {}
