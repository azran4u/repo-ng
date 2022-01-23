import {
  OfficeEquipment,
  OfficeFurniture,
  Software,
} from "../../generated/graphql";

export interface SoftwareWithRef extends Software {
  container_id: string;
}

export interface OfficeEquipmentWithRef extends OfficeEquipment {
  container_id: string;
}

export interface OfficeFurnitureWithRef extends OfficeFurniture {
  container_id: string;
}

export type ItemWithRef =
  | SoftwareWithRef
  | OfficeEquipmentWithRef
  | OfficeFurnitureWithRef;
