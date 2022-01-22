import {
  OfficeEquipment,
  OfficeForniture,
  Software,
} from "../../generated/graphql";

export interface SoftwareWithRef extends Software {
  container_id: string;
}

export interface OfficeEquipmentWithRef extends OfficeEquipment {
  container_id: string;
}

export interface OfficeFornitureWithRef extends OfficeForniture {
  container_id: string;
}
