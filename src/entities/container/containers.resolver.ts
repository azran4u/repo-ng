import {
  Args,
  Context,
  Info,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import DataLoader from "dataloader";
import * as _ from "lodash";
import { Container, QueryContainersArgs } from "../../generated/graphql";
import { ContainerService } from "./containers.service";
import { fieldsList, fieldsMap } from "graphql-fields-list";

@Resolver("Container")
export class ContainersResolver {
  constructor(private containersService: ContainerService) {}

  @Query("containers")
  async getContainers(@Info() info, @Args() args?: QueryContainersArgs) {
    const fm = fieldsMap(info) as any;
    const a = this.containersService.findAllByFilter(
      !!fm.items,
      args?.filter?.byLocation
    );
    return null;
  }
}
