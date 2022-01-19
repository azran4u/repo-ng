import { ContainerDto } from "../../dal/dal.types";
import { baseEntityDtoToBaseEntityConverter } from "../base.entity/base.entity.dto.converter";
import { ContainerWithReferences } from "./container.with.references";

export function containerDtoToContainerConverter(
  dto: ContainerDto
): ContainerWithReferences {
  return {
    ...baseEntityDtoToBaseEntityConverter(dto),
    __typename: "Container",
    storage_locations_id: dto.storage_locations_id,
    items: undefined,
    location: undefined,
  };
}
