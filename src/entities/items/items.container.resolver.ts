import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import DataLoader from "dataloader";
import { Container, Item, ItemsFilter } from "../../generated/graphql";
import * as _ from "lodash";

@Resolver("Software")
export class ItemsContainerResolver {
  @ResolveField("container")
  async container(
    @Parent() item: Item,
    @Context("containersLoader") containersLoader: DataLoader<string, Container>
  ) {
    if (_.isNil(item.id)) return undefined;
    return containersLoader.load(item.id);
  }
}
