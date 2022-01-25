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
  AddOfficeEquipment,
  Item,
  ItemTypes,
  OfficeEquipment,
} from "../../generated/graphql";
import { extractUnionTypesFromGraphqlInfo } from "../../utils/extract.union.types.from.graphql.info";
import { throwIfTooComplex } from "../../utils/is.too.complex.query";
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

  @Mutation("addOfficeEquipment")
  async addOfficeEquipment(
    @Args() args: { input: AddOfficeEquipment[] },
    @Info() info: any,
    @RealityId() realityId: string
  ): Promise<OfficeEquipment[]> {
    throwIfTooComplex(info, ["container", "items"]);
    return this.itemsService.addOfficeEquipment(args.input);
  }
}
