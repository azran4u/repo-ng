import DataLoader from "dataloader";
import {
  ItemWithRef,
  OfficeEquipmentWithRef,
  OfficeFurnitureWithRef,
  SoftwareWithRef,
} from "./item.with.references";
import { ItemsService } from "./items.service";

export function createItemsLoader(itemsService: ItemsService) {
  return new DataLoader<string, ItemWithRef[]>(async (container_ids) => {
    const items = await itemsService.getItems({
      byContainerIds: container_ids,
    });
    const itemsMap = new Map<string, ItemWithRef[]>();
    items.forEach((item) => {
      const current = itemsMap.get(item.container_id) ?? [];
      current.push(item);
      itemsMap.set(item.container_id, current);
    });
    return container_ids.map((id) => itemsMap.get(id));
  });
}

export function createSoftwareItemsLoader(itemsService: ItemsService) {
  return new DataLoader<string, SoftwareWithRef[]>(async (container_ids) => {
    const items = await itemsService.getSoftwareItems({
      byContainerIds: container_ids,
    });
    const itemsMap = new Map<string, SoftwareWithRef[]>();
    items.forEach((item) => {
      const current = itemsMap.get(item.container_id) ?? [];
      current.push(item);
      itemsMap.set(item.container_id, current);
    });
    return container_ids.map((id) => itemsMap.get(id));
  });
}

export function createOfficeFurnitureItemsLoader(itemsService: ItemsService) {
  return new DataLoader<string, OfficeFurnitureWithRef[]>(
    async (container_ids) => {
      const items = await itemsService.getOfficeFurnitureItems({
        byContainerIds: container_ids,
      });
      const itemsMap = new Map<string, OfficeFurnitureWithRef[]>();
      items.forEach((item) => {
        const current = itemsMap.get(item.container_id) ?? [];
        current.push(item);
        itemsMap.set(item.container_id, current);
      });
      return container_ids.map((id) => itemsMap.get(id));
    }
  );
}

export function createOfficeEquipmentItemsLoader(itemsService: ItemsService) {
  return new DataLoader<string, OfficeEquipmentWithRef[]>(
    async (container_ids) => {
      const items = await itemsService.getOfficeEquipmentItems({
        byContainerIds: container_ids,
      });
      const itemsMap = new Map<string, OfficeEquipmentWithRef[]>();
      items.forEach((item) => {
        const current = itemsMap.get(item.container_id) ?? [];
        current.push(item);
        itemsMap.set(item.container_id, current);
      });
      return container_ids.map((id) => itemsMap.get(id));
    }
  );
}
