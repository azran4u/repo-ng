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
import { fieldsMap } from "graphql-fields-list";
import * as _ from "lodash";
import {
  Container,
  Item,
  ItemTypes,
  QueryContainersArgs,
} from "../../generated/graphql";
import { extractUnionTypesFromGraphqlInfo } from "../../utils/extract.union.types.from.graphql.info";
import { throwIfTooComplex } from "../../utils/is.too.complex.query";
import { ContainerService } from "./containers.service";
@Resolver("Container")
export class ContainersResolver {
  constructor(private containersService: ContainerService) {}

  @ResolveField("items")
  async container(
    @Info() info,
    @Parent() container: Container,
    @Context("itemsLoader") itemsLoader: DataLoader<string, Item[]>
  ): Promise<Item[]> {
    if (_.isNil(container?.id)) return [];
    const itemTypesToFetch = extractUnionTypesFromGraphqlInfo(info).map(
      (x) => ItemTypes[x]
    );
    return itemsLoader.load(container.id);
  }

  @Query("containers")
  async getContainers(@Info() info, @Args() args?: QueryContainersArgs) {
    throwIfTooComplex(info, ["items", "container"]);
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
