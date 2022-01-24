import { Args, Info, Query, Resolver } from "@nestjs/graphql";
import { fieldsMap } from "graphql-fields-list";
import { ItemTypes, QueryContainersArgs } from "../../generated/graphql";
import { extractUnionTypesFromGraphqlInfo } from "../../utils/extract.union.types.from.graphql.info";
import { isTooComplex } from "../../utils/is.too.complex.query";
import { ContainerService } from "./containers.service";

@Resolver("Container")
export class ContainersResolver {
  constructor(private containersService: ContainerService) {}

  @Query("containers")
  async getContainers(@Info() info, @Args() args?: QueryContainersArgs) {
    isTooComplex(info, ["items", "container"]);
    const itemTypesToFetch = extractUnionTypesFromGraphqlInfo(
      info,
      "items"
    ).map((x) => ItemTypes[x]);
    const shouldFecthItems = !!fieldsMap(info).items;
    return this.containersService.findAllByFilter(
      shouldFecthItems,
      itemTypesToFetch,
      args?.filter?.byLocation
    );
  }
}
