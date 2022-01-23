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

export interface ItemDto extends BaseEntityDto {
  name: string;
  container_id: string;
}

export interface ItemDtoRef extends BaseEntityDto {
  item_id: string;
}

export interface SoftwareItemDto extends ItemDto, ItemDtoRef {
  is_open_source?: boolean;
}

export interface OfficeFurnitureItemDto extends ItemDto, ItemDtoRef {
  is_wood?: boolean;
}

export interface OfficeEquipmentItemDto extends ItemDto, ItemDtoRef {
  is_fragile?: boolean;
}

export interface ContainerDto extends BaseEntityDto {
  location: StorageLocationsEnum;
}

export interface ContainerDtoWithRef extends BaseEntityDto {
  item_id: string;
}
