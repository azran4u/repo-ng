import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
import { loggerOptionsFactory } from "./logger/logger";
import { configFactory } from "./config/config.factory";
import { GraphQLModule } from "@nestjs/graphql";

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
    GraphQLModule.forRoot({
      typePaths: ["./**/*.graphql"],
      installSubscriptionHandlers: true,
      
    }),
  ],
})
export class AppModule {}
