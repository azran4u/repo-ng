import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
import { AppService } from "./app.service";
import { loggerOptionsFactory } from "./logger/logger";
import { configFactory } from "./config/config.factory";
import { ScrapModule } from "./scrap/scrap.module";
import path = require("path");
import { Logger } from "@azure/functions";
@Module({})
export class AppModule {
  static register(logger: Logger): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          cache: true,
          ignoreEnvFile: true,
          isGlobal: true,
          load: [configFactory],
        }),
        ScrapModule,
        WinstonModule.forRootAsync({
          useFactory: (configService: ConfigService) => {
            return loggerOptionsFactory(
              configService.get("logger.level", { infer: true }), logger
            );
          },
          inject: [ConfigService],
        }),
      ],
      providers: [AppService],
    };
  }
}
