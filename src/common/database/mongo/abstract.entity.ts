import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class AbstractDocument {
  @Prop({ required: true })
  _id: string;

  @Prop({ type: Date, default: () => new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: () => new Date() })
  updatedAt: Date;
}
