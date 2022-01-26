import {
  Args,
  Info,
  Mutation,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { RealityId } from "../../common/decorator/reality.id.decorator";
import {
  Item,
  ItemTypes,
  MoveItem,
  OfficeEquipment,
  RemoveItems,
  UpsertOfficeEquipment,
} from "../../generated/graphql";
import { extractUnionTypesFromGraphqlInfo } from "../../utils/extract.union.types.from.graphql.info";
import { throwIfTooComplex } from "../../utils/is.too.complex.query";
import { ItemWithRef } from "./item.with.references";
import { ItemsService } from "./items.service";

@Resolver("Item")
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @ResolveField()
  __resolveType(obj: Item, context, info) {
    return obj.__typename;
  }

  @Query("items")
  async getItems(@Info() info: any, @RealityId() realityId: string) {
    throwIfTooComplex(info, ["container", "items"]);
    const types = extractUnionTypesFromGraphqlInfo(info).map(
      (x) => ItemTypes[x]
    );
    return this.itemsService.getItems({
      byEntityType: types,
    });
  }

  @Mutation("upsertOfficeEquipment")
  async upsertOfficeEquipment(
    @Args() args: { input: UpsertOfficeEquipment[] },
    @Info() info: any,
    @RealityId() realityId: string
  ): Promise<OfficeEquipment[]> {
    throwIfTooComplex(info, ["container", "items"]);
    return this.itemsService.upsertOfficeEquipment(args.input);
  }

  @Mutation("moveItems")
  async moveItems(
    @Args() args: { input: MoveItem[] },
    @Info() info: any,
    @RealityId() realityId: string
  ): Promise<ItemWithRef[]> {
    throwIfTooComplex(info, ["container", "items"]);
    const types: ItemTypes[] = extractUnionTypesFromGraphqlInfo(info).map(
      (x) => ItemTypes[x]
    );
    return this.itemsService.moveItems(args.input, { byEntityType: types });
  }

  @Mutation((returns) => [String], {
    name: "removeItems",
    description: `returns succesesfully deleted id's`,
  })
  async removeItems(
    @Args() args: { input: RemoveItems },
    @Info() info: any,
    @RealityId() realityId: string
  ): Promise<string[]> {
    return this.itemsService.removeItems(args.input);
  }
}
