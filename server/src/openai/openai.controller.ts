import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common";
import { OpenAiService } from "./openai.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

//----- OpenAI Controller For Generating Content -----//
@Controller("openai")
export class OpenAiController {
  constructor(private readonly openAiService: OpenAiService) {}

  //----- Generate Content -----//
  @UseGuards(JwtAuthGuard)
  @Post("generate")
  async generateContent(@Body() data: any, @Req() req) {
    return this.openAiService.generateContent(data, req.user);
  }

  //----- Generate Content Alias -----//
  @UseGuards(JwtAuthGuard)
  @Post("generate-content")
  async generateContentAlias(@Body() data: any, @Req() req) {
    return this.openAiService.generateContent(data, req.user);
  }
}
