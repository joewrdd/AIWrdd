import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ContentHistory } from "./schemas/content-history.schema";

//----- History Service For Managing User History -----//
@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(ContentHistory.name)
    private contentHistoryModel: Model<ContentHistory>
  ) {}

  //----- Get User History -----//
  async getUserHistory(userId: string): Promise<any> {
    const history = await this.contentHistoryModel
      .find({ user: userId })
      .sort({ createdAt: -1 });

    return {
      status: "success",
      history,
    };
  }

  //----- Get Specific History Item -----//
  async getHistoryItem(historyId: string, userId: string): Promise<any> {
    const content = await this.contentHistoryModel.findOne({
      _id: historyId,
      user: userId,
    });

    if (!content) {
      throw new NotFoundException("Content Not Found.");
    }

    return {
      status: "success",
      content,
    };
  }

  //----- Update Specific History Item -----//
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
      throw new NotFoundException("Content Not Found.");
    }

    if (content.user.toString() !== userId) {
      throw new ForbiddenException(
        "You Are Not Authorized To Update This Content."
      );
    }

    content.content = newContent;
    await content.save();

    return {
      status: "success",
      message: "Content Updated Successfully!!",
      content,
    };
  }

  //----- Delete Specific History Item -----//
  async deleteHistoryItem(historyId: string, userId: string): Promise<any> {
    const content = await this.contentHistoryModel.findOne({
      _id: historyId,
      user: userId,
    });

    if (!content) {
      throw new NotFoundException("Content Not Found.");
    }

    await this.contentHistoryModel.deleteOne({
      _id: historyId,
      user: userId,
    });

    return {
      status: "success",
      message: "Content Deleted Successfully!!",
    };
  }
}
