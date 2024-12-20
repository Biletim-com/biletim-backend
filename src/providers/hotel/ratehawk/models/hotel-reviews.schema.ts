import { AbstractDocument } from '@app/common/database/mongo/abstract.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export class DetailedRatings {
  @Prop({ type: Number, min: 0, max: 10 })
  cleanness: number;

  @Prop({ type: Number, min: 0, max: 10 })
  location: number;

  @Prop({ type: Number, min: 0, max: 10 })
  price: number;

  @Prop({ type: Number, min: 0, max: 10 })
  services: number;

  @Prop({ type: Number, min: 0, max: 10 })
  room: number;

  @Prop({ type: Number, min: 0, max: 10 })
  meal: number;

  @Prop({ type: Number, min: 0, max: 10 })
  wifi: number;

  @Prop({ type: Number, min: 0, max: 10, required: false })
  hygiene: number;
}
export const DetailedRatingsSchema =
  SchemaFactory.createForClass(DetailedRatings);

export class Reviews {
  @Prop()
  reviewPlus: string;

  @Prop()
  reviewMinus: string;

  @Prop({ type: Date })
  created: Date;

  @Prop()
  author: string;

  @Prop({ type: Number, min: 0 })
  adults: number;

  @Prop({ type: Number, min: 0, required: false })
  children: number;

  @Prop()
  roomName: string;

  @Prop({ type: Number, min: 1 })
  nights: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: DetailedRatingsSchema })
  detailed: DetailedRatings;

  @Prop()
  travellerType: string;

  @Prop()
  tripType: string;

  @Prop({ type: Number, min: 0, max: 10 })
  rating: number;
}
export const ReviewsSchema = SchemaFactory.createForClass(Reviews);

@Schema({ collection: 'hotel_reviews_collection' })
export class HotelReviewsDocument extends AbstractDocument {
  @Prop({ required: true })
  id: string;

  @Prop({ required: false, type: DetailedRatingsSchema })
  detailedRatings: DetailedRatings;

  @Prop({ type: Number, required: false })
  hid: number;

  @Prop({ required: false, type: Number, min: 0, max: 10 })
  rating: number;

  @Prop({ required: false, type: [ReviewsSchema] })
  reviews: Reviews[];
}
export const HotelReviewsSchema =
  SchemaFactory.createForClass(HotelReviewsDocument);
