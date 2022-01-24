import DataLoader from "dataloader";
import { Item } from "../../generated/graphql";
import { ItemsService } from "./items.service";

export function createItemsLoader(itemsService: ItemsService) {
  return new DataLoader<string, Item[]>(async (container_ids) => {
    const items = await itemsService.getItems({
      byContainerIds: container_ids,
    });
    const itemsMap = new Map<string, Item[]>();
    items.forEach((item) => {
      const current = itemsMap.get(item.container_id) ?? [];
      current.push(item);
      itemsMap.set(item.container_id, current);
    });
    return container_ids.map((id) => itemsMap.get(id));
  });
}
