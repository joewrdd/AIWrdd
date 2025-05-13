import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { UsersService } from "../users/users.service";
import { SubscriptionType } from "../users/schemas/user.schema";

//----- Subscription Tasks For Handling Subscription Tasks -----//
@Injectable()
export class SubscriptionTasks {
  private readonly logger = new Logger(SubscriptionTasks.name);

  constructor(private readonly usersService: UsersService) {}

  //----- Handle Trial Period Expirations -----//
  @Cron(CronExpression.EVERY_HOUR)
  async handleTrialExpiration() {
    this.logger.log("Checking Trial Period Expirations...");
    try {
      await this.usersService.updateTrialUsers();
    } catch (error) {
      this.logger.error(`Error Updating Trial Users: ${error.message}`);
    }
  }

  //----- Reset Free Users' Request Count -----//
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async resetFreeUsersRequestCount() {
    this.logger.log("Resetting Monthly Request Count For Free Users...");
    try {
      await this.usersService.resetMonthlyRequests(SubscriptionType.FREE);
    } catch (error) {
      this.logger.error(
        `Error Resetting Free Users' Request Count: ${error.message}`
      );
    }
  }

  //----- Reset Basic Users' Request Count -----//
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async resetBasicUsersRequestCount() {
    this.logger.log("Resetting Monthly Request Count For Basic Users...");
    try {
      await this.usersService.resetMonthlyRequests(SubscriptionType.BASIC);
    } catch (error) {
      this.logger.error(
        `Error Resetting Basic Users' Request Count: ${error.message}`
      );
    }
  }

  //----- Reset Premium Users' Request Count -----//
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async resetPremiumUsersRequestCount() {
    this.logger.log("Resetting Monthly Request Count For Premium Users...");
    try {
      await this.usersService.resetMonthlyRequests(SubscriptionType.PREMIUM);
    } catch (error) {
      this.logger.error(
        `Error Resetting Premium Users' Request Count: ${error.message}`
      );
    }
  }
}
