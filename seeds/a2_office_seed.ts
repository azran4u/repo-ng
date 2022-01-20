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
  StorageLocationDto,
} from "../src/dal/dal.types";
import { randomIntFromInterval } from "../src/utils/randomIntFromInterval";
import { StorageLocationsEnum } from "../src/generated/graphql";

export async function seed(knex: Knex): Promise<void> {
  await knex("container_items").del();
  await knex("containers").del();
  await knex("storage_locations").del();
  await knex("office_forniture").del();
  await knex("office_equipment").del();
  await knex("software").del();
  await knex("items").del();

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
  const items = Array(6)
    .fill(null)
    .map((): Omit<ItemDto, "created_at" | "updated_at"> => {
      return {
        ...createBaseEntity(),
        name: faker.name.findName(),
      };
    });

  const softwares = [0, 1].map(
    (x): Pick<SoftwareItemDto, "item_id" | "is_open_source"> => {
      return {
        item_id: items[x].id,
        is_open_source: false,
      };
    }
  );

  const office_equipments = [2, 3].map(
    (x): Pick<OfficeEquipmentItemDto, "item_id" | "is_fragile"> => {
      return {
        item_id: items[x].id,
        is_fragile: false,
      };
    }
  );

  const office_fornitures = [4, 5].map(
    (x): Pick<OfficeFornitureItemDto, "item_id" | "is_wood"> => {
      return {
        item_id: items[x].id,
        is_wood: false,
      };
    }
  );

  const storage_locations: Omit<
    StorageLocationDto,
    "created_at" | "updated_at"
  >[] = [
    {
      id: uuidv4(),
      name: StorageLocationsEnum.Center,
      reality_id: 1,
      classification: "UNCLAS",
      created_by: "eyal",
      updated_by: "azran",
      is_deleted: false,
      is_classified: false,
      sec_groups: [],
    },
    {
      id: uuidv4(),
      name: StorageLocationsEnum.North,
      reality_id: 1,
      classification: "UNCLAS",
      created_by: "eyal",
      updated_by: "azran",
      is_deleted: false,
      is_classified: false,
      sec_groups: [],
    },
    {
      id: uuidv4(),
      name: StorageLocationsEnum.South,
      reality_id: 1,
      classification: "UNCLAS",
      created_by: "eyal",
      updated_by: "azran",
      is_deleted: false,
      is_classified: false,
      sec_groups: [],
    },
  ];

  const containers: Omit<ContainerDto, "created_at" | "updated_at">[] = [
    {
      ...createBaseEntity(),
      storage_locations_id: storage_locations[0].id,
    },
    {
      ...createBaseEntity(),
      storage_locations_id: storage_locations[1].id,
    },
    {
      ...createBaseEntity(),
      storage_locations_id: storage_locations[2].id,
    },
  ];

  const container_items = [
    [0, 0],
    [1, 1],
  ].map((x): { item_id: string; container_id: string } => {
    return {
      item_id: items[x[0]].id,
      container_id: containers[x[1]].id,
    };
  });

  await knex("items").insert(items);
  await knex("software").insert(softwares);
  await knex("office_equipment").insert(office_equipments);
  await knex("office_forniture").insert(office_fornitures);
  await knex("storage_locations").insert(storage_locations);
  await knex("containers").insert(containers);
  await knex("container_items").insert(container_items);
}
