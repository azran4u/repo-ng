import { Module } from "@nestjs/common";
import { DalModule } from "../../dal/dal.module";
import { ContainersResolver } from "./containers.resolver";
import { ContainerService } from "./containers.service";

@Module({
  imports: [DalModule],
  providers: [ContainerService, ContainersResolver],
  exports: [ContainerService],
})
export class ContainersModule {}
