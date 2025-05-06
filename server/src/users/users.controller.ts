import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  UseGuards,
  Req,
} from "@nestjs/common";
import { Response } from "express";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post("login")
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const result = await this.usersService.login(loginUserDto);

    response.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    const { token, ...userData } = result;
    return userData;
  }

  @Post("logout")
  async logout(@Res({ passthrough: true }) response: Response) {
    response.cookie("token", "", { maxAge: 1 });
    return { message: "Logged Out Successfully!!" };
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getUserProfile(@Req() req) {
    return this.usersService.getUserProfile(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("auth/check")
  async checkAuth() {
    return { isAuthenticated: true };
  }
}
