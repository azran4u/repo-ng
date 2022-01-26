import { StorageLocationsEnum } from "../generated/graphql";

export interface BaseEntityDto {
  classification?: string;
  created_at: Date;
  created_by?: string;
  id: string;
  is_classified: boolean;
  is_deleted: boolean;
  reality_id: number;
  sec_groups?: string[];
  updated_at: Date;
  updated_by?: string;
}

export interface ItemFieldsDto {
  name: string;
  container_id: string;
}
export interface ItemDto extends BaseEntityDto, ItemFieldsDto {}

export interface ItemRefDto {
  item_id: string;
}

export interface SoftwareItemFieldsDto extends ItemRefDto {
  is_open_source?: boolean;
}
export interface SoftwareItemDto extends ItemDto, SoftwareItemFieldsDto {}

export interface OfficeFurnitureItemFieldsDto extends ItemRefDto {
  is_wood?: boolean;
}
export interface OfficeFurnitureItemDto
  extends ItemDto,
    OfficeFurnitureItemFieldsDto {}

export interface OfficeEquipmentItemOwnFieldsDto {
  is_fragile?: boolean;
}
export interface OfficeEquipmentItemFieldsDto
  extends ItemRefDto,
    OfficeEquipmentItemOwnFieldsDto {}

export interface OfficeEquipmentItemDto
  extends ItemDto,
    OfficeEquipmentItemFieldsDto {}

export interface ContainerDto extends BaseEntityDto {
  location: StorageLocationsEnum;
}

export interface ContainerDtoWithRef extends BaseEntityDto, ItemRefDto {}

export type BaseEntityExcludedInputTypes =
  | "is_deleted"
  | "created_at"
  | "created_by"
  | "updated_at"
  | "updated_by";

export type BaseItemExcludedInputTypes = "name" | "container_id";
export interface CreateItemDto
  extends Omit<ItemDto, BaseEntityExcludedInputTypes> {}

export interface CreateSoftwareDto
  extends Omit<
    SoftwareItemDto,
    BaseEntityExcludedInputTypes | BaseItemExcludedInputTypes
  > {}
export interface CreateOfficeFurnitureDto
  extends Omit<
    OfficeFurnitureItemDto,
    BaseEntityExcludedInputTypes | BaseItemExcludedInputTypes
  > {}

export interface CreateOfficeEquipmentDto
  extends OfficeEquipmentItemFieldsDto,
    ItemRefDto {}
