import { Module } from "@nestjs/common";
import { KnexModule } from "nestjs-knex";
import { knexLoadConfig } from "../utils/knex.load.config";
import { DalService } from "./dal.service";

@Module({
  imports: [
    KnexModule.forRootAsync({
      useFactory: () => {
        return { config: knexLoadConfig() };
      },
    }),
  ],
  providers: [DalService],
  exports: [DalService],
})
export class DalModule {}
