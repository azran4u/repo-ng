import { NestFactory } from "@nestjs/core";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { AppModule } from "./app.module";

import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER);
    app.useLogger(logger);
    logger.info(`Starting app`);
    await app.listen(3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error(`nest factory error ${error}`);
  }
}
bootstrap();
