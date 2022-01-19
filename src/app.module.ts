import { MiddlewareConsumer, Module } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import { loggerOptionsFactory } from "./logger/logger";
import { GraphQLModule } from "@nestjs/graphql";
import { GraphqlExtractOperationMiddleware } from "./utils/graphql-extract-operation-middlewatr";
import { json } from "express";
import { RequestDurationMiddleware } from "./utils/express-request-duration";
import { CatsModule } from "./entities/cats/cats.module";
import { OwnersModule } from "./entities/owners/owners.module";
import { OwnersService } from "./entities/owners/owners.service";
import { createOwnersLoader } from "./entities/owners/owners.loader";
import { CommonModule } from "./common/common.module";
import { DalModule } from "./dal/dal.module";
import { AppConfigModule, AppConfigService } from "./config";
import { ItemsModule } from "./entities/items/items.module";

@Module({
  imports: [
    AppConfigModule,
    WinstonModule.forRootAsync({
      useFactory: (configService: AppConfigService) => {
        return loggerOptionsFactory(configService.getConfig().logger.level);
      },
      inject: [AppConfigService],
    }),
    CommonModule,
    DalModule,
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
    CatsModule,
    ItemsModule,
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
