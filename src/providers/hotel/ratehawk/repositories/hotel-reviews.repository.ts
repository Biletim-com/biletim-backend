import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AbstractRepository } from '@app/common/database/mongo/abstract.repository';

import { HotelReviewsDocument } from '../models/hotel-reviews.schema';

@Injectable()
export class HotelReviewsRepository extends AbstractRepository<HotelReviewsDocument> {
  protected readonly logger = new Logger(HotelReviewsRepository.name);

  constructor(
    @InjectModel(HotelReviewsDocument.name)
    hotelReviewsModel: Model<HotelReviewsDocument>,
  ) {
    super(hotelReviewsModel);
  }
}
