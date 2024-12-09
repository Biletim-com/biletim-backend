import { AbstractRepository } from '@app/common/database/mongo/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HotelDocument } from './models/hotel.schema';

@Injectable()
export class HotelRepository extends AbstractRepository<HotelDocument> {
  protected readonly logger = new Logger(HotelRepository.name);

  constructor(
    @InjectModel(HotelDocument.name)
    hotelModel: Model<HotelDocument>,
  ) {
    super(hotelModel);
  }
}
