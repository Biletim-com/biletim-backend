import { Module } from '@nestjs/common';

import { BiletAllPlaneModule } from '@app/providers/ticket/biletall/plane/provider.module';

import { PlaneSearchController } from './plane-search.controller';

@Module({
  imports: [BiletAllPlaneModule],
  controllers: [PlaneSearchController],
})
export class PlaneSearchModule {}
