import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HistoryController } from "./history.controller";
import { HistoryService } from "./history.service";
import {
  ContentHistory,
  ContentHistorySchema,
} from "./schemas/content-history.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContentHistory.name, schema: ContentHistorySchema },
    ]),
  ],
  controllers: [HistoryController],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
