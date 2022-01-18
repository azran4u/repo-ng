import { Module } from "@nestjs/common";
import { KnexModule } from "nestjs-knex";
import { getKnexConfig } from "../utils/getKnexConfig";
import { DalService } from "./dal.service";

@Module({
  imports: [
    KnexModule.forRootAsync({
      useFactory: () => {
        return { config: getKnexConfig() };
      },
    }),
  ],
  providers: [DalService],
  exports: [DalService],
})
export class DalModule {}
