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
  Item,
  ItemTypes,
  QueryContainersArgs,
} from "../../generated/graphql";
import { extractUnionTypesFromGraphqlInfo } from "../../utils/extract.union.types.from.graphql.info";
import { throwIfTooComplex } from "../../utils/is.too.complex.query";
import {
  ItemWithRef,
  OfficeFurnitureWithRef,
  SoftwareWithRef,
} from "../items/item.with.references";
import { ContainerService } from "./containers.service";
@Resolver("Container")
export class ContainersResolver {
  constructor(private containersService: ContainerService) {}

  @ResolveField("items")
  async container(
    @Info() info,
    @Parent() container: Container,
    @Context("softwareItemsLoader")
    softwareItemsLoader: DataLoader<string, SoftwareWithRef[]>,
    @Context("officeEquipmentItemsLoader")
    officeEquipmentItemsLoader: DataLoader<string, OfficeFurnitureWithRef[]>,
    @Context("officeFurnitureItemsLoader")
    officeFurnitureItemsLoader: DataLoader<string, OfficeFurnitureWithRef[]>
  ): Promise<Item[]> {
    if (_.isNil(container?.id)) return [];
    const loaders = [];
    extractUnionTypesFromGraphqlInfo(info).forEach((x) => {
      if (ItemTypes[x] === ItemTypes.Software) {
        loaders.push(softwareItemsLoader.load(container.id));
      }
      if (ItemTypes[x] === ItemTypes.OfficeEquipment) {
        loaders.push(officeEquipmentItemsLoader.load(container.id));
      }
      if (ItemTypes[x] === ItemTypes.OfficeFurniture) {
        loaders.push(officeFurnitureItemsLoader.load(container.id));
      }
    });

    const res = await Promise.all(loaders);
    return res.reduce((acc, curr) => {
      if (curr) acc.push(...curr);
      return acc;
    }, [] as ItemWithRef[]);
  }

  @Query("containers")
  async getContainers(@Info() info, @Args() args?: QueryContainersArgs) {
    throwIfTooComplex(info, ["items", "container"]);
    return this.containersService.findAllByFilter(args.filter.byLocation);
  }
}
