import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { truncate } from 'fs';

import { HydratedDocument, Types } from 'mongoose';
import { SellerRequestStatus } from './selller.enum.js';

export type SellerRequestDocument = HydratedDocument<SellerRequest>;
@Schema({ timestamps: true })
export class SellerRequest {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  UserId = Types.ObjectId;
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  storeName: string;
  @Prop({ required: true, type: String })
  phone: string;
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  description: string;
  @Prop({
    type: String,
    enum: SellerRequestStatus,
    default: SellerRequestStatus.PENDING,
  })
  status: SellerRequestStatus;
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  ReviewedBy?: Types.ObjectId;
  @Prop({
    type: String,
  })
  avatar?: string;

  @Prop()
  reviewedAt?: Date;
  @Prop()
  rejectionReason?: string;
}
export const SellerRequestSchema = SchemaFactory.createForClass(SellerRequest);
