import { Args, Info, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Item, ItemTypes } from "../../generated/graphql";
import { ItemsService } from "./items.service";
import * as _ from "lodash";
import { fieldsList, fieldsMap } from "graphql-fields-list";
import { GraphQLError } from "graphql";
import { RealityId } from "../../common/decorator/reality.id.decorator";
import { extractUnionTypesFromGraphqlInfo } from "../../utils/extract.union.types.from.graphql.info";

@Resolver("Item")
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @ResolveField()
  __resolveType(obj: Item, context, info) {
    return obj.__typename;
  }

  @Query("items")
  async getItems(@Info() info: any, @RealityId() realityId?: string) {
    const types = extractUnionTypesFromGraphqlInfo(info).map(
      (x) => ItemTypes[x]
    );
    // const fl = fieldsList(info); may be used to select only requested fields
    const fm = fieldsMap(info) as any;
    if (fm?.container?.items) throw new GraphQLError(`Query is too complex`);
    return this.itemsService.findAll(types);
  }
}
