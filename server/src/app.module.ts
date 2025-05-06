import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { UsersModule } from "./users/users.module";
import { OpenAiModule } from "./openai/openai.module";
import { PaymentModule } from "./payment/payment.module";
import { HistoryModule } from "./history/history.module";
import { AuthModule } from "./auth/auth.module";
import { TasksModule } from "./tasks/tasks.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>("MONGODB_URI");
        console.log("MongoDB URI:", uri ? "Configured" : "Not Configured");

        return {
          uri: uri || "mongodb://localhost:27017/aiwrdd",
          connectionFactory: (connection) => {
            connection.on("connected", () => {
              console.log("✅ MongoDB Is Connected");
            });

            connection.on("error", (error) => {
              console.error("❌ MongoDB Connection Error:", error.message);
              console.log(
                "⚠️ Some Features Requiring Database Access Will Not Work Until MongoDB Is Connected"
              );
            });

            return connection;
          },
          connectionErrorFactory: (error) => {
            console.error("❌ Failed to Connect to MongoDB:", error.message);
            console.log(
              "⚠️ Application Is Running in Limited Mode Without Database Access"
            );
            console.log(
              "ℹ️ To Use Database Features, Please Install MongoDB or Update Your Connection String"
            );
            return null;
          },
        };
      },
    }),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
      exclude: ["/api*"],
    }),
    UsersModule,
    OpenAiModule,
    PaymentModule,
    HistoryModule,
    AuthModule,
    TasksModule,
  ],
})
export class AppModule {}
