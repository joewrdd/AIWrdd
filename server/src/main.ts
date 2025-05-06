import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import * as express from "express";

async function bootstrap() {
  const expressApp = express();

  expressApp.use(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" })
  );

  expressApp.use((req, res, next) => {
    if (req.originalUrl === "/api/stripe/webhook") {
      next();
    } else {
      express.json()(req, res, next);
    }
  });

  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.use(expressApp);

  app.use(cookieParser());

  app.enableCors({
    origin: ["http://localhost:4001", "http://localhost:3000"],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders:
      "Content-Type, Accept, Authorization, Cache-Control, Pragma, Expires",
    exposedHeaders: "Content-Range, X-Content-Range",
    maxAge: 3600,
  });

  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());

  const PORT = process.env.PORT || 3008;
  await app.listen(PORT);
  console.log(`Server Is Running On Port ${PORT}`);
}

bootstrap();
