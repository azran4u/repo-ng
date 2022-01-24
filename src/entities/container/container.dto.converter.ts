import { ContainerDto } from "../../dal/dal.types";
import { Container, StorageLocationsEnum } from "../../generated/graphql";
import { baseEntityDtoToBaseEntityConverter } from "../base.entity/base.entity.dto.converter";

export function containerDtoToContainerConverter(dto: ContainerDto): Container {
  const res: Container = {
    ...baseEntityDtoToBaseEntityConverter(dto),
    __typename: "Container",
    items: undefined,
    location: dto.location as StorageLocationsEnum,
  };
  return res;
}
