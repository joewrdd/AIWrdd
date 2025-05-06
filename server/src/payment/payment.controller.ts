import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  RawBodyRequest,
  Res,
  Param,
  Get,
} from "@nestjs/common";
import { Response, Request } from "express";
import { PaymentService } from "./payment.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("stripe")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post("create-checkout-session")
  async createCheckoutSession(@Body() body: any, @Req() req) {
    return this.paymentService.createCheckoutSession(body, req.user);
  }

  @Post("webhook")
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    try {
      const signature = req.headers["stripe-signature"] as string;

      if (!signature) {
        console.error("Webhook Error: Missing Stripe signature");
        return res.status(400).send("Missing Stripe signature");
      }

      const rawBody = req.body;

      if (!rawBody) {
        console.error("Webhook Error: Missing Request Body");
        return res.status(400).send("Missing Request Body");
      }

      console.log(
        `Received Webhook With Signature: ${signature.substring(0, 20)}...`
      );

      const result = await this.paymentService.handleWebhook(
        rawBody,
        signature
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error(`Webhook Error: ${error.message}`);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post("free-plan")
  async activateFreePlan(@Req() req) {
    return this.paymentService.activateFreePlan(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("checkout")
  async createPaymentIntent(@Body() paymentData: any, @Req() req) {
    return this.paymentService.createPaymentIntent(paymentData, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("verify-payment/:paymentId")
  async verifyPayment(@Param("paymentId") paymentId: string, @Req() req) {
    return this.paymentService.verifyPayment(paymentId, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("update-subscription")
  async updateSubscription(@Body() body: any, @Req() req) {
    return this.paymentService.updateSubscription(body.paymentId, req.user);
  }

  // Debug endpoints
  @UseGuards(JwtAuthGuard)
  @Get("payments")
  async getUserPayments(@Req() req) {
    return this.paymentService.getUserPayments(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("fix-subscription")
  async fixSubscription(@Req() req) {
    return this.paymentService.fixUserSubscription(req.user._id);
  }
}
