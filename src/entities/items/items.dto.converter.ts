import {
  OfficeEquipmentItemDto,
  OfficeFurnitureItemDto,
  SoftwareItemDto,
} from "../../dal/dal.types";
import { itemDtoToItemConverter } from "./item.dto.converter";
import {
  OfficeEquipmentWithRef,
  OfficeFurnitureWithRef,
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

export function officeFurnitureItemDtoToOfficeFurnitureConverter(
  dto: OfficeFurnitureItemDto
): OfficeFurnitureWithRef {
  return {
    ...itemDtoToItemConverter(dto),
    __typename: "OfficeFurniture",
    isWood: dto.is_wood,
    container_id: dto.container_id,
  };
}
