import { Context, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import DataLoader from "dataloader";
import { Container, Item } from "../../generated/graphql";
import * as _ from "lodash";

@Resolver("Software")
export class SoftwareItemsContainerResolver {
  @ResolveField("container")
  async container(
    @Parent() item: Item,
    @Context("containersLoader") containersLoader: DataLoader<string, Container>
  ) {
    if (_.isNil(item.id)) return undefined;
    return containersLoader.load(item.id);
  }
}
@Resolver("OfficeForniture")
export class OfficeFornitureItemsContainerResolver {
  @ResolveField("container")
  async container(
    @Parent() item: Item,
    @Context("containersLoader") containersLoader: DataLoader<string, Container>
  ) {
    if (_.isNil(item.id)) return undefined;
    return containersLoader.load(item.id);
  }
}

@Resolver("OfficeEquipment")
export class OfficeEquipmentItemsContainerResolver {
  @ResolveField("container")
  async container(
    @Parent() item: Item,
    @Context("containersLoader") containersLoader: DataLoader<string, Container>
  ) {
    if (_.isNil(item.id)) return undefined;
    return containersLoader.load(item.id);
  }
}
