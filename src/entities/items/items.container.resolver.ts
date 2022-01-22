import { Context, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import DataLoader from "dataloader";
import { Container } from "../../generated/graphql";
import * as _ from "lodash";
import {
  OfficeEquipmentWithRef,
  OfficeFornitureWithRef,
  SoftwareWithRef,
} from "./item.with.references";

@Resolver("Software")
export class SoftwareItemsContainerResolver {
  @ResolveField("container")
  async container(
    @Parent() item: SoftwareWithRef,
    @Context("containersLoader") containersLoader: DataLoader<string, Container>
  ) {
    if (_.isNil(item.container_id)) return undefined;
    return containersLoader.load(item.container_id);
  }
}
@Resolver("OfficeForniture")
export class OfficeFornitureItemsContainerResolver {
  @ResolveField("container")
  async container(
    @Parent() item: OfficeFornitureWithRef,
    @Context("containersLoader") containersLoader: DataLoader<string, Container>
  ) {
    if (_.isNil(item.container_id)) return undefined;
    return containersLoader.load(item.container_id);
  }
}

@Resolver("OfficeEquipment")
export class OfficeEquipmentItemsContainerResolver {
  @ResolveField("container")
  async container(
    @Parent() item: OfficeEquipmentWithRef,
    @Context("containersLoader") containersLoader: DataLoader<string, Container>
  ) {
    if (_.isNil(item.container_id)) return undefined;
    return containersLoader.load(item.container_id);
  }
}
