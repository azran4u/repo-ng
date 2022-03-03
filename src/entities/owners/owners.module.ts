import { Module } from "@nestjs/common";
import { KnexModule } from "nestjs-knex";
import { knexLoadConfig } from "../../utils/knex.load.config";
import { OwnersService } from "./owners.service";

@Module({
  imports: [
    KnexModule.forRootAsync({
      useFactory: () => {
        return { config: knexLoadConfig() };
      },
    }),
  ],
  providers: [OwnersService],
  exports: [OwnersService],
})
export class OwnersModule {}
