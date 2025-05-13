import { Module } from "@nestjs/common";
import { OpenAiController } from "./openai.controller";
import { OpenAiService } from "./openai.service";
import { UsersModule } from "../users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import {
  ContentHistory,
  ContentHistorySchema,
} from "../history/schemas/content-history.schema";

//----- OpenAI Module For Generating Content -----//
@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: ContentHistory.name, schema: ContentHistorySchema },
    ]),
  ],
  controllers: [OpenAiController],
  providers: [OpenAiService],
})
export class OpenAiModule {}
