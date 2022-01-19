import { Module } from "@nestjs/common";
import { DalModule } from "../../dal/dal.module";
import { ItemsContainerResolver } from "./items.container.resolver";
import { ItemsResolver } from "./items.resolver";
import { ItemsService } from "./items.service";

@Module({
  imports: [DalModule],
  providers: [ItemsService, ItemsResolver, ItemsContainerResolver],
})
export class ItemsModule {}
