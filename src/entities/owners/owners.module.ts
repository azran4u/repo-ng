import { Module } from "@nestjs/common";
import { KnexModule } from "nestjs-knex";
import * as knexfile from "../../../knexfile";
import { getKnexConfig } from "../../utils/getKnexConfig";
import { OwnersService } from "./owners.service";

@Module({
  imports: [
    KnexModule.forRootAsync({
      useFactory: () => {
        return { config: getKnexConfig() };
      },
    }),
  ],
  providers: [OwnersService],
  exports: [OwnersService],
})
export class OwnersModule {}
