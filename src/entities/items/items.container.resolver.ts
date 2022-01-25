import { Context, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import DataLoader from "dataloader";
import * as _ from "lodash";
import { Container } from "../../generated/graphql";
import {
  OfficeEquipmentWithRef,
  OfficeFurnitureWithRef,
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
@Resolver("OfficeFurniture")
export class OfficeFurnitureItemsContainerResolver {
  @ResolveField("container")
  async container(
    @Parent() item: OfficeFurnitureWithRef,
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
