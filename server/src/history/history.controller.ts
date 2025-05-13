import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from "@nestjs/common";
import { HistoryService } from "./history.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

//----- History Controller For Managing User History -----//
@Controller("history")
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  //----- Get User History -----//
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserHistory(@Req() req) {
    return this.historyService.getUserHistory(req.user._id);
  }

  //----- Get Specific History Item -----//
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getHistoryItem(@Param("id") id: string, @Req() req) {
    return this.historyService.getHistoryItem(id, req.user._id);
  }

  //----- Update Specific History Item -----//
  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async updateHistoryItem(
    @Param("id") id: string,
    @Body() data: { content: string },
    @Req() req
  ) {
    return this.historyService.updateHistoryItem(
      id,
      data.content,
      req.user._id
    );
  }

  //----- Delete Specific History Item -----//
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteHistoryItem(@Param("id") id: string, @Req() req) {
    return this.historyService.deleteHistoryItem(id, req.user._id);
  }
}
