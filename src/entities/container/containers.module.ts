import { Module } from "@nestjs/common";
import { DalModule } from "../../dal/dal.module";
import { ItemsModule } from "../items/items.module";
import { ContainersResolver } from "./containers.resolver";
import { ContainerService } from "./containers.service";

@Module({
  imports: [DalModule, ItemsModule],
  providers: [ContainerService, ContainersResolver],
  exports: [ContainerService],
})
export class ContainersModule {}
