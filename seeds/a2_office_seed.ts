import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";
import * as faker from "faker";
import {
  BaseEntityDto,
  ContainerDto,
  ItemDto,
  OfficeEquipmentItemDto,
  OfficeFornitureItemDto,
  SoftwareItemDto,
} from "../src/dal/dal.types";
import { randomIntFromInterval } from "../src/utils/randomIntFromInterval";
import { StorageLocationsEnum } from "../src/generated/graphql";

export async function seed(knex: Knex): Promise<void> {
  await knex("office_forniture").del();
  await knex("office_equipment").del();
  await knex("software").del();
  await knex("items").del();
  await knex("containers").del();

  const createBaseEntity = (): Omit<
    BaseEntityDto,
    "created_at" | "updated_at"
  > => {
    return {
      id: uuidv4(),
      reality_id: randomIntFromInterval(1, 3),
      classification: "UNCLAS",
      created_by: faker.name.findName(),
      updated_by: faker.name.findName(),
      is_deleted: faker.datatype.boolean(),
      is_classified: faker.datatype.boolean(),
      sec_groups: Array.from({ length: 3 }, () => faker.datatype.string()),
    };
  };

  const containers: Omit<ContainerDto, "created_at" | "updated_at">[] = [
    {
      ...createBaseEntity(),
      location: StorageLocationsEnum.Center,
    },
    {
      ...createBaseEntity(),
      location: StorageLocationsEnum.North,
    },
    {
      ...createBaseEntity(),
      location: StorageLocationsEnum.South,
    },
  ];

  const items = [0, 1, 2, 0, 1, 2].map(
    (container_index): Omit<ItemDto, "created_at" | "updated_at"> => {
      return {
        ...createBaseEntity(),
        name: faker.name.findName(),
        container_id: containers[container_index].id,
      };
    }
  );

  const softwares = [0, 1].map(
    (item_index): Pick<SoftwareItemDto, "item_id" | "is_open_source"> => {
      return {
        item_id: items[item_index].id,
        is_open_source: false,
      };
    }
  );

  const office_equipments = [2, 3].map(
    (item_index): Pick<OfficeEquipmentItemDto, "item_id" | "is_fragile"> => {
      return {
        item_id: items[item_index].id,
        is_fragile: false,
      };
    }
  );

  const office_fornitures = [4, 5].map(
    (item_index): Pick<OfficeFornitureItemDto, "item_id" | "is_wood"> => {
      return {
        item_id: items[item_index].id,
        is_wood: false,
      };
    }
  );

  await knex("containers").insert(containers);
  await knex("items").insert(items);
  await knex("software").insert(softwares);
  await knex("office_equipment").insert(office_equipments);
  await knex("office_forniture").insert(office_fornitures);
}
