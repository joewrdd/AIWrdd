import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import Stripe from "stripe";
import { Payment, PaymentStatus } from "./schemas/payment.schema";
import { User, SubscriptionType } from "../users/schemas/user.schema";
import { UsersService } from "../users/users.service";

//----- Payment Service For Handling Stripe Payments -----//
@Injectable()
export class PaymentService {
  private stripe: Stripe;

  //----- Constructor For Initializing Stripe Service -----//
  constructor(
    private configService: ConfigService,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    private usersService: UsersService
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>("STRIPE_SECRET_KEY"),
      {
        apiVersion: "2025-01-27.acacia",
      }
    );
  }

  //----- Create Checkout Session -----//
  async createCheckoutSession(data: any, user: User): Promise<any> {
    try {
      const { priceId } = data;

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${this.configService.get<string>("FRONTEND_URL")}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.configService.get<string>("FRONTEND_URL")}/payment/cancel`,
        customer_email: user.email,
        client_reference_id: user._id.toString(),
      });

      return { sessionId: session.id, url: session.url };
    } catch (error) {
      throw new BadRequestException(
        error.message || "Failed to create checkout session"
      );
    }
  }

  //----- Handle Stripe Webhook -----//
  async handleWebhook(rawBody: Buffer, signature: string): Promise<any> {
    try {
      const webhookSecret = this.configService.get<string>(
        "STRIPE_WEBHOOK_SECRET"
      );
      if (!webhookSecret) {
        throw new Error("Webhook Secret Is Not Configured");
      }

      let event;
      try {
        event = this.stripe.webhooks.constructEvent(
          rawBody,
          signature,
          webhookSecret
        );
      } catch (err) {
        throw new Error(
          `Webhook Signature Verification Failed: ${err.message}`
        );
      }
      //----- Switch Case For Handling Different Stripe Events -----//
      switch (event.type) {
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;

          await this.handleSuccessfulPayment(checkoutSession);
          break;

        case "payment_intent.succeeded":
          const paymentIntent = event.data.object as Stripe.PaymentIntent;

          if (paymentIntent.metadata?.userId) {
            await this.handleSuccessfulPaymentIntent(paymentIntent);
          } else {
            console.log(
              `No User ID In Metadata For Payment Intent: ${paymentIntent.id}`
            );
          }
          break;

        case "payment_intent.payment_failed":
          const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;

          await this.paymentModel.findOneAndUpdate(
            { stripePaymentId: failedPaymentIntent.id },
            { status: PaymentStatus.FAILED }
          );
          break;

        default:
          console.log(`Unhandled Event Type: ${event.type}`);
      }

      return { received: true, status: "success", type: event.type };
    } catch (error) {
      console.error(`Webhook Error: ${error.message}`);
      console.error(error.stack);
      throw new BadRequestException(`Webhook Error: ${error.message}`);
    }
  }

  //----- Handle Successful Payment -----//
  private async handleSuccessfulPayment(
    session: Stripe.Checkout.Session
  ): Promise<void> {
    const userId = session.client_reference_id;
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new BadRequestException("User Not Found...");
    }

    //----- Create Payment Record -----//
    const payment = new this.paymentModel({
      amount: session.amount_total / 100,
      currency: session.currency,
      paymentMethod: "card",
      status: PaymentStatus.COMPLETED,
      stripePaymentId: session.id,
      user: user._id,
    });

    await payment.save();

    const subscription = await this.stripe.subscriptions.retrieve(
      session.subscription as string
    );

    const productId = subscription.items.data[0].price.product as string;
    const product = await this.stripe.products.retrieve(productId);

    //----- Determine Subscription Type -----//
    let subscriptionType = SubscriptionType.BASIC;
    if (
      product.name.includes("Premium") ||
      product.metadata.tier === "premium"
    ) {
      subscriptionType = SubscriptionType.PREMIUM;
    }

    user.subscription = subscriptionType;
    user.trialActive = false;
    user.monthlyRequestCount =
      subscriptionType === SubscriptionType.PREMIUM ? 100 : 50;

    //----- Calculate Next Billing Date -----//
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    user.nextBillingDate = nextBillingDate;

    await user.save();
  }

  //----- Handle Successful Payment Intent -----//
  private async handleSuccessfulPaymentIntent(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    //----- Try Catch Block For Handling Errors -----//
    try {
      const userId = paymentIntent.metadata.userId;
      if (!userId) {
        console.error(
          `No User ID In Metadata For Payment Intent: ${paymentIntent.id}`
        );
        return;
      }

      const user = await this.usersService.findById(userId);
      if (!user) {
        console.error(`User Not Found For ID: ${userId}`);
        return;
      }

      let payment = await this.paymentModel.findOne({
        stripePaymentId: paymentIntent.id,
      });

      //----- If Payment Record Does Not Exist, Create New Payment Record -----//
      if (!payment) {
        payment = new this.paymentModel({
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          paymentMethod: "card",
          status: PaymentStatus.COMPLETED,
          stripePaymentId: paymentIntent.id,
          user: user._id,
        });
        await payment.save();
      } else {
        payment.status = PaymentStatus.COMPLETED;
        await payment.save();
      }

      //----- Determine Subscription Type -----//
      let subscriptionType: SubscriptionType;
      let monthlyRequestCount: number;

      const amount = paymentIntent.amount / 100;
      const subscriptionPlan =
        paymentIntent.metadata?.subscriptionPlan ||
        (amount >= 50 ? "premium" : "basic");

      if (subscriptionPlan === "premium" || amount >= 50) {
        subscriptionType = SubscriptionType.PREMIUM;
        monthlyRequestCount = 100;
      } else {
        subscriptionType = SubscriptionType.BASIC;
        monthlyRequestCount = 50;
      }

      user.subscription = subscriptionType;
      user.trialActive = false;
      user.monthlyRequestCount = monthlyRequestCount;

      const nextBillingDate = new Date();
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      user.nextBillingDate = nextBillingDate;

      await user.save();
    } catch (error) {
      console.error(`Error Handling Payment Intent: ${error.message}`);
    }
  }

  //----- Activate Free Plan -----//
  async activateFreePlan(user: User): Promise<any> {
    try {
      user.subscription = SubscriptionType.FREE;
      user.trialActive = false;
      user.monthlyRequestCount = 5;

      const nextBillingDate = new Date();
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      user.nextBillingDate = nextBillingDate;

      await user.save();

      return {
        status: "success",
        message: "Free Plan Activated Successfully!!",
        subscription: user.subscription,
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || "Failed To Activate Free Plan"
      );
    }
  }

  //----- Create Payment Intent -----//
  async createPaymentIntent(paymentData: any, user: User): Promise<any> {
    try {
      const { amount, subscriptionPlan } = paymentData;

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          userId: user._id.toString(),
          subscriptionPlan: subscriptionPlan,
          userEmail: user.email,
        },
      });

      const payment = new this.paymentModel({
        amount,
        currency: "usd",
        paymentMethod: "card",
        status: PaymentStatus.PENDING,
        stripePaymentId: paymentIntent.id,
        user: user._id,
      });

      await payment.save();

      return {
        status: "success",
        clientSecret: paymentIntent.client_secret,
        paymentId: paymentIntent.id,
        metadata: {
          userEmail: user.email,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || "Failed To Create Payment Intent"
      );
    }
  }

  //----- Verify Payment -----//
  async verifyPayment(paymentId: string, user: User): Promise<any> {
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentId);

      if (paymentIntent.status !== "succeeded") {
        return {
          status: "error",
          message: "Payment Not Completed...",
          paymentStatus: paymentIntent.status,
        };
      }

      await this.paymentModel.findOneAndUpdate(
        { stripePaymentId: paymentId },
        { status: PaymentStatus.COMPLETED }
      );

      return {
        status: "success",
        message: "Payment Verified Successfully!!",
        paymentStatus: paymentIntent.status,
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || "Failed To Verify Payment"
      );
    }
  }

  //----- Update Subscription -----//
  async updateSubscription(paymentId: string, user: User): Promise<any> {
    try {
      const payment = await this.paymentModel.findOne({
        stripePaymentId: paymentId,
      });

      if (!payment) {
        const newPayment = new this.paymentModel({
          amount: 20,
          currency: "usd",
          paymentMethod: "card",
          status: PaymentStatus.COMPLETED,
          stripePaymentId: paymentId,
          user: user._id,
        });

        await newPayment.save();
      } else {
        console.error(
          `Found Existing Payment: ${payment._id}, Status: ${payment.status}`
        );

        if (payment.status !== PaymentStatus.COMPLETED) {
          payment.status = PaymentStatus.COMPLETED;
          await payment.save();
        }
      }

      //----- Try Catch Block For Handling Errors -----//
      try {
        //----- Retrieve Payment Intent -----//
        const paymentIntent =
          await this.stripe.paymentIntents.retrieve(paymentId);

        const subscriptionPlan =
          paymentIntent.metadata?.subscriptionPlan || "basic";

        let subscriptionType: SubscriptionType;
        let monthlyRequestCount: number;

        if (subscriptionPlan === "premium") {
          subscriptionType = SubscriptionType.PREMIUM;
          monthlyRequestCount = 100;
        } else if (subscriptionPlan === "basic") {
          subscriptionType = SubscriptionType.BASIC;
          monthlyRequestCount = 50;
        } else {
          subscriptionType = SubscriptionType.FREE;
          monthlyRequestCount = 5;
        }

        const previousSubscription = user.subscription;
        const previousTrialState = user.trialActive;

        user.subscription = subscriptionType;
        user.trialActive = false;
        user.monthlyRequestCount = monthlyRequestCount;

        const nextBillingDate = new Date();
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        user.nextBillingDate = nextBillingDate;

        await user.save();

        return {
          status: "success",
          message: "Subscription Updated Successfully!!",
          subscription: user.subscription,
          previousSubscription,
          monthlyRequestCount,
        };
      } catch (stripeError) {
        console.error(
          `Error Retrieving Payment Intent From Stripe: ${stripeError.message}`
        );

        const subscriptionType = SubscriptionType.BASIC;
        const monthlyRequestCount = 50;

        const previousSubscription = user.subscription;
        const previousTrialState = user.trialActive;

        user.subscription = subscriptionType;
        user.trialActive = false;
        user.monthlyRequestCount = monthlyRequestCount;

        const nextBillingDate = new Date();
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        user.nextBillingDate = nextBillingDate;

        await user.save();

        return {
          status: "success",
          message: "Subscription Updated With Default Basic Plan",
          subscription: user.subscription,
          previousSubscription,
          monthlyRequestCount,
        };
      }
    } catch (error) {
      console.error(
        `Error Updating Subscription: ${error.message}`,
        error.stack
      );
      throw new BadRequestException(
        error.message || "Failed To Update Subscription"
      );
    }
  }

  //----- Get User Payments -----//
  async getUserPayments(userId: string): Promise<any> {
    try {
      const payments = await this.paymentModel
        .find({ user: userId })
        .sort({ createdAt: -1 });
      const user = await this.usersService.findById(userId);

      return {
        status: "success",
        user: {
          id: user._id,
          email: user.email,
          subscription: user.subscription,
          trialActive: user.trialActive,
          monthlyRequestCount: user.monthlyRequestCount,
          nextBillingDate: user.nextBillingDate,
        },
        payments: payments,
        count: payments.length,
      };
    } catch (error) {
      console.error(`Error Fetching Payments: ${error.message}`);
      throw new BadRequestException("Failed To Fetch Payment Information");
    }
  }

  //----- Fix User Subscription As A Backup For Stripe Webhook Failure -----//
  async fixUserSubscription(userId: string): Promise<any> {
    try {
      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new BadRequestException("User Not Found...");
      }

      const payments = await this.paymentModel
        .find({
          user: userId,
          status: PaymentStatus.COMPLETED,
        })
        .sort({ createdAt: -1 });

      if (payments.length === 0) {
        return {
          status: "error",
          message: "No Completed Payments Found For This User...",
        };
      }

      const latestPayment = payments[0];

      let subscriptionType: SubscriptionType;
      let monthlyRequestCount: number;
      let subscriptionName = "";

      try {
        if (
          latestPayment.stripePaymentId &&
          !latestPayment.stripePaymentId.startsWith("manual")
        ) {
          const paymentIntent = await this.stripe.paymentIntents.retrieve(
            latestPayment.stripePaymentId
          );

          const subscriptionPlan =
            paymentIntent.metadata?.subscriptionPlan ||
            (latestPayment.amount >= 50 ? "premium" : "basic");

          if (subscriptionPlan === "premium") {
            subscriptionType = SubscriptionType.PREMIUM;
            monthlyRequestCount = 100;
            subscriptionName = "Premium";
          } else {
            subscriptionType = SubscriptionType.BASIC;
            monthlyRequestCount = 50;
            subscriptionName = "Basic";
          }
        } else {
          if (latestPayment.amount >= 50) {
            subscriptionType = SubscriptionType.PREMIUM;
            monthlyRequestCount = 100;
            subscriptionName = "Premium";
          } else {
            subscriptionType = SubscriptionType.BASIC;
            monthlyRequestCount = 50;
            subscriptionName = "Basic";
          }
        }
      } catch (error) {
        console.error(`Error Retrieving Payment From Stripe: ${error.message}`);
        if (latestPayment.amount >= 50) {
          subscriptionType = SubscriptionType.PREMIUM;
          monthlyRequestCount = 100;
          subscriptionName = "Premium";
        } else {
          subscriptionType = SubscriptionType.BASIC;
          monthlyRequestCount = 50;
          subscriptionName = "Basic";
        }
      }

      const previousSubscription = user.subscription;
      const previousTrialState = user.trialActive;
      const previousRequestCount = user.monthlyRequestCount;

      user.subscription = subscriptionType;
      user.trialActive = false;
      user.monthlyRequestCount = monthlyRequestCount;

      if (!user.nextBillingDate) {
        const nextBillingDate = new Date();
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        user.nextBillingDate = nextBillingDate;
      }

      await user.save();

      return {
        status: "success",
        message: `Subscription Fixed Successfully. Changed From ${previousSubscription} To ${subscriptionName}`,
        user: {
          id: user._id,
          email: user.email,
          previousSubscription,
          newSubscription: user.subscription,
          previousTrialState,
          newTrialState: user.trialActive,
          previousRequestCount,
          newRequestCount: user.monthlyRequestCount,
          nextBillingDate: user.nextBillingDate,
        },
        payment: {
          id: latestPayment._id,
          amount: latestPayment.amount,
          status: latestPayment.status,
          paymentMethod: latestPayment.paymentMethod,
        },
      };
    } catch (error) {
      console.error(`Error Fixing Subscription: ${error.message}`);
      throw new BadRequestException(
        `Failed To Fix Subscription: ${error.message}`
      );
    }
  }
}
