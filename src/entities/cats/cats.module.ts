import { Module } from "@nestjs/common";
import { KnexModule } from "nestjs-knex";
import { DalModule } from "../../dal/dal.module";
import { getKnexConfig } from "../../utils/getKnexConfig";
import { OwnersModule } from "../owners/owners.module";
import { CatOwnerResolver } from "./cat-owner.resolver";
import { CatsResolver } from "./cats.resolver";
import { CatsService } from "./cats.service";

@Module({
  imports: [
    OwnersModule,
    DalModule,
    // KnexModule.forRootAsync({
    //   useFactory: () => {
    //     return { config: getKnexConfig() };
    //   },
    // }),
  ],
  providers: [CatsService, CatsResolver, CatOwnerResolver],
})
export class CatsModule {}
