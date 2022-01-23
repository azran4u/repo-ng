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
import {
  Container,
  ItemTypes,
  QueryContainersArgs,
} from "../../generated/graphql";
import { ContainerService } from "./containers.service";
import { fieldsList, fieldsMap } from "graphql-fields-list";
import { extractUnionTypesFromGraphqlInfo } from "../../utils/extract.union.types.from.graphql.info";

@Resolver("Container")
export class ContainersResolver {
  constructor(private containersService: ContainerService) {}

  @Query("containers")
  async getContainers(@Info() info, @Args() args?: QueryContainersArgs) {
    const fm = fieldsMap(info) as any;
    const types = extractUnionTypesFromGraphqlInfo(info, "items").map(
      (x) => ItemTypes[x]
    );
    return this.containersService.findAllByFilter(
      !!fm.items,
      types,
      args?.filter?.byLocation
    );
  }
}
