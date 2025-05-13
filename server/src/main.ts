import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import * as express from "express";

//----- Bootstrap Function For Starting The Server -----//
async function bootstrap() {
  const expressApp = express();

  //----- Stripe Webhook Route -----//
  expressApp.use(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" })
  );

  //----- JSON Parser For Stripe Webhook -----//
  expressApp.use((req, res, next) => {
    if (req.originalUrl === "/api/stripe/webhook") {
      next();
    } else {
      express.json()(req, res, next);
    }
  });

  //----- NestJS Factory For Creating The App -----//
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.use(expressApp);

  //----- Cookie Parser For Handling Cookies -----//
  app.use(cookieParser());

  //----- Enable CORS For Allowed Origins -----//
  app.enableCors({
    origin: ["http://localhost:4001", "http://localhost:3000"],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders:
      "Content-Type, Accept, Authorization, Cache-Control, Pragma, Expires",
    exposedHeaders: "Content-Range, X-Content-Range",
    maxAge: 3600,
  });

  //----- Set Global Prefix For API Routes -----//
  app.setGlobalPrefix("api");

  //----- Enable Validation Pipe For Handling Validation Errors -----//
  app.useGlobalPipes(new ValidationPipe());

  //----- Set Port For Listening To Requests -----//
  const PORT = process.env.PORT || 3008;
  await app.listen(PORT);
  console.log(`Server Is Running On Port ${PORT}`);
}

//----- Start The Server -----//
bootstrap();
