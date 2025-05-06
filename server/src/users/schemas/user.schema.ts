import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export enum SubscriptionType {
  FREE = "Free",
  BASIC = "Basic",
  PREMIUM = "Premium",
  TRIAL = "Trial",
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 3 })
  trialPeriod: number;

  @Prop({ default: true })
  trialActive: boolean;

  @Prop()
  trialExpires: Date;

  @Prop({
    type: String,
    enum: Object.values(SubscriptionType),
    default: SubscriptionType.TRIAL,
  })
  subscription: string;

  @Prop({ default: 0 })
  apiRequestCount: number;

  @Prop({ default: 25 })
  monthlyRequestCount: number;

  @Prop()
  nextBillingDate: Date;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: "Payment" }] })
  payments: MongooseSchema.Types.ObjectId[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: "ContentHistory" }],
  })
  history: MongooseSchema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
