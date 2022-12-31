import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { json } from 'express';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { WinstonModule } from 'nest-winston';
import { CommonModule } from './common/common.module';
import { AppConfigModule, AppConfigService } from './config';
import { DalModule } from './dal/dal.module';
import { CatsModule } from './entities/cats/cats.module';
import { createContainersLoader } from './entities/container/containers.loader';
import { ContainersModule } from './entities/container/containers.module';
import { ContainerService } from './entities/container/containers.service';
import {
  createItemsLoader,
  createOfficeEquipmentItemsLoader,
  createOfficeFurnitureItemsLoader,
  createSoftwareItemsLoader,
} from './entities/items/items.loader';
import { ItemsModule } from './entities/items/items.module';
import { ItemsService } from './entities/items/items.service';
import { createOwnersLoader } from './entities/owners/owners.loader';
import { OwnersModule } from './entities/owners/owners.module';
import { OwnersService } from './entities/owners/owners.service';
import { loggerOptionsFactory } from './logger/logger';
import { PaginationModule } from './pagination/pagination.module';
import { PersistencyModule } from './persistency/persistency.module';
import { RequestDurationMiddleware } from './utils/express.request.duration';
import { UserMiddleware } from './utils/express.user.middleware';
import { GraphqlExtractOperationMiddleware } from './utils/graphql.extract.operation.middleware';
import { isProd } from './utils/is.prod';

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
      imports: [OwnersModule, ContainersModule, ItemsModule],
      useFactory: (
        ownersService: OwnersService,
        containerService: ContainerService,
        itemsService: ItemsService
      ) => ({
        typePaths: ['./**/*.graphql'],
        context: () => ({
          randomValue: Math.random(),
          ownersLoader: createOwnersLoader(ownersService),
          containersLoader: createContainersLoader(containerService),
          itemsLoader: createItemsLoader(itemsService),
          softwareItemsLoader: createSoftwareItemsLoader(itemsService),
          officeEquipmentItemsLoader:
            createOfficeEquipmentItemsLoader(itemsService),
          officeFurnitureItemsLoader:
            createOfficeFurnitureItemsLoader(itemsService),
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
      inject: [OwnersService, ContainerService, ItemsService],
    }),
    CatsModule,
    ItemsModule,
    ContainersModule,
    PaginationModule,
    PersistencyModule,
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
      .forRoutes('*');
    consumer.apply(UserMiddleware);
  }
}
