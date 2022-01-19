import { Software } from "../../generated/graphql";
import { SoftwareItemDto } from "../../dal/dal.types";
import { itemDtoToItemConverter } from "./item.dto.converter";

export function softwareItemDtoToSoftwareItemConverter(
  dto: SoftwareItemDto
): Software {
  return {
    ...itemDtoToItemConverter(dto),
    isOpenSource: dto.is_open_source,
    __typename: "Software",
  };
}
