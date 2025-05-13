import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../users/schemas/user.schema";

//----- JWT Strategy For Authentication -----//
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }

  //----- Validate JWT Token -----//
  async validate(payload: any) {
    const user = await this.userModel.findById(payload.id).select("-password");
    if (!user) {
      throw new UnauthorizedException("Login first to access this resource");
    }
    return user;
  }
}
