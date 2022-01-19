import { OfficeForniture } from "../../generated/graphql";
import { OfficeFornitureItemDto } from "../../dal/dal.types";
import { itemDtoToItemConverter } from "./item.dto.converter";

export function officeFornitureItemDtoToOfficeFornitureConverter(
  dto: OfficeFornitureItemDto
): OfficeForniture {
  return {
    ...itemDtoToItemConverter(dto),
    isWood: dto.is_wood,
    __typename: "OfficeForniture",
  };
}
