import { Module } from "@nestjs/common";
import { SubscriptionTasks } from "./subscription.tasks";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [UsersModule],
  providers: [SubscriptionTasks],
})
export class TasksModule {}
