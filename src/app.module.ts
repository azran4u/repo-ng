import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
import { loggerOptionsFactory } from "./logger/logger";
import { configFactory } from "./config/config.factory";
import { GraphQLModule } from "@nestjs/graphql";
import { GraphqlExtractOperationMiddleware } from "./utils/graphql-extract-operation-middlewatr";
import { json } from "express";
import { RequestDurationMiddleware } from "./utils/express-request-duration";
import { CatsModule } from "./entities/cats/cats.module";
import { OwnersModule } from "./entities/owners/owners.module";
import { OwnersService } from "./entities/owners/owners.service";
import { createOwnersLoader } from "./entities/owners/owners.loader";
import { CommonModule } from "./common/common.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      ignoreEnvFile: true,
      isGlobal: true,
      load: [configFactory],
    }),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return loggerOptionsFactory(
          configService.get("logger.level", { infer: true })
        );
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync({
      imports: [OwnersModule],
      useFactory: (ownersService: OwnersService) => ({
        typePaths: ["./**/*.graphql"],
        context: () => ({
          randomValue: Math.random(),
          ownersLoader: createOwnersLoader(ownersService),
        }),
      }),
      inject: [OwnersService],
    }),
    CommonModule,
    CatsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        json(),
        RequestDurationMiddleware,
        GraphqlExtractOperationMiddleware
      )
      .forRoutes("*");
  }
}
