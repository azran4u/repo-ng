import { Args, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Item, ItemsFilter } from "../../generated/graphql";
import { ItemsService } from "./items.service";

@Resolver("Item")
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @ResolveField()
  __resolveType(obj: Item, context, info) {
    return obj.__typename;
  }

  @Query("items")
  async getItems(@Args("filter") args?: ItemsFilter) {
    const res = await this.itemsService.findAll(args?.byTypes);
    if (!res) return [];
    return res;
  }
}
