import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { User, SubscriptionType } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async register(
    createUserDto: CreateUserDto
  ): Promise<{ status: boolean; message: string; user: any }> {
    const { username, email, password } = createUserDto;

    if (!username || !email || !password) {
      throw new BadRequestException(
        "All Fields Are Required. Please Fill All The Fields."
      );
    }

    const userExists = await this.userModel.findOne({ email });
    if (userExists) {
      throw new BadRequestException(
        "User Already Exists! Please Use Another Email Or Login."
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new this.userModel({
      username,
      password: hashedPassword,
      email,
    });

    newUser.trialExpires = new Date(
      new Date().getTime() + newUser.trialPeriod * 24 * 60 * 60 * 1000
    );

    await newUser.save();

    return {
      status: true,
      message: "Registration Was Successful. Please Login To Continue.",
      user: {
        username,
        email,
      },
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const { email, password } = loginUserDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException(
        "Invalid Email Or Password. Please Try Again."
      );
    }

    const isMatchPass = await bcrypt.compare(password, user.password);
    if (!isMatchPass) {
      throw new UnauthorizedException(
        "Invalid Email Or Password. Please Try Again."
      );
    }

    const token = this.jwtService.sign({ id: user._id });

    return {
      status: "success",
      _id: user._id,
      message: "Login Successful",
      username: user.username,
      email: user.email,
      token,
    };
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).select("-password");
  }

  async getUserProfile(userId: string): Promise<any> {
    const user = await this.userModel
      .findById(userId)
      .select("-password")
      .populate("payments")
      .populate("history");

    if (!user) {
      throw new BadRequestException("User Not Found. Please Try Again.");
    }

    return {
      status: "success",
      user,
    };
  }

  async updateTrialUsers() {
    const presentDate = new Date();
    await this.userModel.updateMany(
      {
        trialActive: true,
        trialExpires: { $lt: presentDate },
      },
      {
        trialActive: false,
        subscription: SubscriptionType.FREE,
        monthlyRequestCount: 5,
      }
    );
  }

  async resetMonthlyRequests(subscriptionType: SubscriptionType) {
    const presentDate = new Date();
    await this.userModel.updateMany(
      {
        subscription: subscriptionType,
        nextBillingDate: { $lt: presentDate },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  }
}
