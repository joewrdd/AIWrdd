import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../../users/schemas/user.schema";

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  })
  status: string;

  @Prop()
  stripePaymentId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  user: User;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
