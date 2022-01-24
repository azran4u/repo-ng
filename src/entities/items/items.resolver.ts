import { Info, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Item, ItemTypes } from "../../generated/graphql";
import { ItemsService } from "./items.service";
import * as _ from "lodash";
import { RealityId } from "../../common/decorator/reality.id.decorator";
import { extractUnionTypesFromGraphqlInfo } from "../../utils/extract.union.types.from.graphql.info";
import { isTooComplex } from "../../utils/is.too.complex.query";

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
    isTooComplex(info, ["container", "items"]);
    return this.itemsService.findAll(types);
  }
}
