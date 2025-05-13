import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../../users/schemas/user.schema";

//----- Content History Schema -----//
@Schema({ timestamps: true })
export class ContentHistory extends Document {
  @Prop({ required: true })
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  user: User;
}

export const ContentHistorySchema =
  SchemaFactory.createForClass(ContentHistory);
