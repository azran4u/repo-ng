import {
  OfficeEquipmentItemDto,
  OfficeFornitureItemDto,
  SoftwareItemDto,
} from "../../dal/dal.types";
import { itemDtoToItemConverter } from "./item.dto.converter";
import {
  OfficeEquipmentWithRef,
  OfficeFornitureWithRef,
  SoftwareWithRef,
} from "./item.with.references";

export function softwareItemDtoToSoftwareItemConverter(
  dto: SoftwareItemDto
): SoftwareWithRef {
  return {
    ...itemDtoToItemConverter(dto),
    __typename: "Software",
    isOpenSource: dto.is_open_source,
    container_id: dto.container_id,
  };
}

export function officeEquipmentItemDtoToOfficeEquipmentItemConverter(
  dto: OfficeEquipmentItemDto
): OfficeEquipmentWithRef {
  return {
    ...itemDtoToItemConverter(dto),
    __typename: "OfficeEquipment",
    isFragile: dto.is_fragile,
    container_id: dto.container_id,
  };
}

export function officeFornitureItemDtoToOfficeFornitureConverter(
  dto: OfficeFornitureItemDto
): OfficeFornitureWithRef {
  return {
    ...itemDtoToItemConverter(dto),
    __typename: "OfficeForniture",
    isWood: dto.is_wood,
    container_id: dto.container_id,
  };
}
