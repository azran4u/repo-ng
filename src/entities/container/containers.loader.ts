import DataLoader from "dataloader";
import { Container } from "../../generated/graphql";
import { mapFromArray } from "../../utils/mapFromArray";
import { containerDtoToContainerConverter } from "./container.dto.converter";
import { ContainerService } from "./containers.service";

export function createContainersLoader(containerService: ContainerService) {
  return new DataLoader<string, Container>(async (ids) => {
    const containers = await containerService.getByIds(ids);
    const containersMap = mapFromArray(
      containers,
      (container) => container?.id
    );
    return ids.map((id) => {
      const value = containersMap[id];
      if (!value) return null;
      const res = containerDtoToContainerConverter(value);
      return res;
    });
  });
}
