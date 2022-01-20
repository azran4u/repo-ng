import { Module } from "@nestjs/common";
import { DalModule } from "../../dal/dal.module";
import {
  OfficeEquipmentItemsContainerResolver,
  OfficeFornitureItemsContainerResolver,
  SoftwareItemsContainerResolver,
} from "./items.container.resolver";
import { ItemsResolver } from "./items.resolver";
import { ItemsService } from "./items.service";

@Module({
  imports: [DalModule],
  providers: [
    ItemsService,
    ItemsResolver,
    OfficeEquipmentItemsContainerResolver,
    OfficeFornitureItemsContainerResolver,
    SoftwareItemsContainerResolver,
  ],
})
export class ItemsModule {}
