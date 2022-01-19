import { Module } from "@nestjs/common";
import { DalModule } from "../../dal/dal.module";
import { OwnersModule } from "../owners/owners.module";
import { CatOwnerResolver } from "./cat-owner.resolver";
import { CatsResolver } from "./cats.resolver";
import { CatsService } from "./cats.service";

@Module({
  imports: [OwnersModule, DalModule],
  providers: [CatsService, CatsResolver, CatOwnerResolver],
})
export class CatsModule {}
