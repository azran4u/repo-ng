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
import { ContainerService } from "./entities/container/containers.service";
import { ContainersModule } from "./entities/container/containers.module";
import { createContainersLoader } from "./entities/container/containers.loader";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { isProd } from "./utils/is.prod";

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
      imports: [OwnersModule, ContainersModule],
      useFactory: (
        ownersService: OwnersService,
        containerService: ContainerService
      ) => ({
        typePaths: ["./**/*.graphql"],
        context: () => ({
          randomValue: Math.random(),
          ownersLoader: createOwnersLoader(ownersService),
          containersLoader: createContainersLoader(containerService),
        }),
        formatError: (error: GraphQLError) => {
          // don't print stacktrace in prod
          if (isProd() || true) {
            delete error.extensions.exception.stacktrace;
          }
          const graphQLFormattedError: GraphQLFormattedError = {
            ...error,
          };
          return graphQLFormattedError;
        },
      }),
      inject: [OwnersService, ContainerService],
    }),
    CatsModule,
    ItemsModule,
    ContainersModule,
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
