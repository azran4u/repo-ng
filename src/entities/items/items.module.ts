import { Module } from "@nestjs/common";
import { DalModule } from "../../dal/dal.module";
import {
  OfficeEquipmentItemsContainerResolver,
  OfficeFurnitureItemsContainerResolver,
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
    OfficeFurnitureItemsContainerResolver,
    SoftwareItemsContainerResolver,
  ],
  exports: [ItemsService],
})
export class ItemsModule {}
