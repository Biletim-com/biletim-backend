import { AbstractDocument } from '@app/common/database/mongo/abstract.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'hotel_data_collection' })
export class HotelDocument extends AbstractDocument {
  @Prop()
  address: string;

  @Prop({ required: true, type: [Object] })
  amenityGroups: object[];

  @Prop()
  checkInTime: string;

  @Prop()
  checkOutTime: string;

  @Prop({ required: true, type: Object })
  descriptionStruct: Record<string, any>;

  @Prop()
  email: string;

  @Prop({ required: false, type: Object })
  facts: Record<string, any>;

  @Prop({ required: false })
  frontDeskTimeEnd: string;

  @Prop({ required: false })
  frontDeskTimeStart: string;

  @Prop({ required: true })
  hid: string;

  @Prop()
  hotelChain: string;

  @Prop({ required: true })
  id: string;

  @Prop({ required: true, type: [String] })
  images: string[];

  @Prop({ required: true, type: [Object] })
  imagesExt: object[];

  @Prop()
  isClosed: boolean;

  @Prop({ required: true })
  isGenderSpecificationRequired: boolean;

  @Prop({ required: false, type: Object })
  keysPickup: Record<string, any>;

  @Prop()
  kind: string;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop()
  metapolicyExtraInfo: string;

  @Prop({ required: true, type: Object })
  metapolicyStruct: Record<string, any>;

  @Prop()
  name: string;

  @Prop({ required: true, type: [String] })
  paymentMethods: string[];

  @Prop()
  phone: string;

  @Prop({ required: false, type: [Object] })
  policyStruct: object[];

  @Prop()
  postalCode: string;

  @Prop({ required: false, type: Object })
  region: Record<string, any>;

  @Prop({ required: true, type: Object })
  roomGroups: Record<string, any>;

  @Prop({ required: true, type: [String] })
  serpFilters: string[];

  @Prop({ required: false, type: Object })
  starCertificate: Record<string, any>;

  @Prop()
  starRating: number;
}

export const HotelSchema = SchemaFactory.createForClass(HotelDocument);
