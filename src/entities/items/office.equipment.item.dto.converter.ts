import { OfficeEquipment } from "../../generated/graphql";
import { OfficeEquipmentItemDto } from "../../dal/dal.types";
import { itemDtoToItemConverter } from "./item.dto.converter";

export function officeEquipmentItemDtoToOfficeEquipmentItemConverter(
  dto: OfficeEquipmentItemDto
): OfficeEquipment {
  return {
    ...itemDtoToItemConverter(dto),
    isFragile: dto.is_fragile,
    __typename: "OfficeEquipment",
  };
}
