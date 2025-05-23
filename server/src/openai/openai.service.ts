import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { ContentHistory } from "../history/schemas/content-history.schema";
import { User } from "../users/schemas/user.schema";

//----- OpenAI Service For Generating Content -----//
@Injectable()
export class OpenAiService {
  private geminiClient: GoogleGenerativeAI;
  private geminiModel: GenerativeModel;

  //----- Constructor For Initializing OpenAI Service -----//
  constructor(
    private configService: ConfigService,
    @InjectModel(ContentHistory.name)
    private contentHistoryModel: Model<ContentHistory>
  ) {
    this.geminiClient = new GoogleGenerativeAI(
      this.configService.get<string>("GOOGLE_API_KEY")
    );

    this.geminiModel = this.geminiClient.getGenerativeModel({
      model: "gemini-1.5-pro",
    });
  }

  //----- Generate Content -----//
  async generateContent(data: any, user: User): Promise<any> {
    const { prompt } = data;

    //----- Check If User Has Reached Monthly Request Limit -----//
    if (user.monthlyRequestCount <= 0) {
      throw new BadRequestException("Monthly Request Limit Reached");
    }

    //----- Generate Content Using Gemini Model -----//
    try {
      const result = await this.geminiModel.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You Are A Content Generation Assistant For AIWrdd. ${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 500,
        },
      });

      const response = result.response;
      const content = response.text();

      const newHistory = new this.contentHistoryModel({
        content,
        user: user._id,
      });

      await newHistory.save();

      //----- Update User Request Count -----//
      await this.updateUserRequestCount(user);

      return {
        status: "success",
        message: content,
        content: content,
        model: "Gemini 1.5 Pro",
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new BadRequestException(
        error.message || "Failed To Generate Content"
      );
    }
  }

  //----- Update User Request Count -----//
  private async updateUserRequestCount(user: User): Promise<void> {
    user.apiRequestCount += 1;
    user.monthlyRequestCount -= 1;
    await user.save();
  }
}
