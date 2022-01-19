import { Module } from "@nestjs/common";
import { DalModule } from "../../dal/dal.module";
import { ContainerService } from "./containers.service";

@Module({
  imports: [DalModule],
  providers: [ContainerService],
  exports: [ContainerService],
})
export class ContainersModule {}
