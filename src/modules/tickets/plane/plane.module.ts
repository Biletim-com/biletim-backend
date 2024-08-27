import { Module } from '@nestjs/common';
import { PlaneController } from './plane.controller';
import { BiletAllService } from '../bus/services/biletall/biletall.service';
import { BiletAllApiConfigService } from '@app/configs/bilet-all-api/config.service';
import { BiletAllParser } from '../bus/services/biletall/biletall.parser';
import { BiletallPlaneService } from './services/biletall/biletall-plane.service';
import { BiletallPlaneParser } from './services/biletall/biletall-plane.parser';
import { PlaneService } from './services/plane.service';

@Module({
  controllers: [PlaneController],
  providers: [
    PlaneService,
    BiletAllService,
    BiletallPlaneParser,
    BiletAllApiConfigService,
    BiletAllParser,
    BiletallPlaneService,
  ],
})
export class PlaneModule {}
