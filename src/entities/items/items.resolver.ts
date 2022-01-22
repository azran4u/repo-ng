import { Args, Info, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Item, ItemsFilter } from "../../generated/graphql";
import { ItemsService } from "./items.service";
import * as _ from "lodash";
import { fieldsList, fieldsMap } from "graphql-fields-list";
import { GraphQLError } from "graphql";

@Resolver("Item")
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @ResolveField()
  __resolveType(obj: Item, context, info) {
    return obj.__typename;
  }

  @Query("items")
  async getItems(@Info() info, @Args("filter") args?: ItemsFilter) {
    // const fl = fieldsList(info);
    const fm = fieldsMap(info) as any;
    if (fm?.container?.items) throw new GraphQLError(`Query is too complex`);
    debugger;
    return this.itemsService.findAll(args?.byTypes);
  }
}
