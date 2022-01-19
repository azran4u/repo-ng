import { Module } from "@nestjs/common";
import { DalModule } from "../../dal/dal.module";
import { ItemsResolver } from "./items.resolver";
import { ItemsService } from "./items.service";

@Module({
  imports: [DalModule],
  providers: [ItemsService, ItemsResolver],
})
export class ItemsModule {}
