import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ContentHistory } from "./schemas/content-history.schema";

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(ContentHistory.name)
    private contentHistoryModel: Model<ContentHistory>
  ) {}

  async getUserHistory(userId: string): Promise<any> {
    const history = await this.contentHistoryModel
      .find({ user: userId })
      .sort({ createdAt: -1 });

    return {
      status: "success",
      history,
    };
  }

  async getHistoryItem(historyId: string, userId: string): Promise<any> {
    const content = await this.contentHistoryModel.findOne({
      _id: historyId,
      user: userId,
    });

    if (!content) {
      throw new NotFoundException("Content not found");
    }

    return {
      status: "success",
      content,
    };
  }

  async updateHistoryItem(
    historyId: string,
    newContent: string,
    userId: string
  ): Promise<any> {
    const content = await this.contentHistoryModel.findOne({
      _id: historyId,
      user: userId,
    });

    if (!content) {
      throw new NotFoundException("Content not found");
    }

    // Ensure the user owns this content
    if (content.user.toString() !== userId) {
      throw new ForbiddenException(
        "You are not authorized to update this content"
      );
    }

    content.content = newContent;
    await content.save();

    return {
      status: "success",
      message: "Content updated successfully",
      content,
    };
  }

  async deleteHistoryItem(historyId: string, userId: string): Promise<any> {
    const content = await this.contentHistoryModel.findOne({
      _id: historyId,
      user: userId,
    });

    if (!content) {
      throw new NotFoundException("Content not found");
    }

    await this.contentHistoryModel.deleteOne({
      _id: historyId,
      user: userId,
    });

    return {
      status: "success",
      message: "Content deleted successfully",
    };
  }
}
