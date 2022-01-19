import { Item } from "../../generated/graphql";
import { ItemDto } from "../../dal/dal.types";
import { baseEntityDtoToBaseEntityConverter } from "../base.entity/base.entity.dto.converter";

export function itemDtoToItemConverter(dto: ItemDto): Item {
  return {
    ...baseEntityDtoToBaseEntityConverter(dto),
    name: dto.name,
  };
}
