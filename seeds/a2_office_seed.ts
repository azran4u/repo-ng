import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
  const uuid1 = uuidv4();
  const uuid2 = uuidv4();

  await knex("container_items").del();
  await knex("containers").del();
  await knex("storage_locations").del();
  await knex("office_forniture").del();
  await knex("office_equipment").del();
  await knex("software").del();
  await knex("items").del();

  await knex("items").insert([
    {
      id: uuid1,
      name: "first item",
      reality_id: 1,
      classification: "UNCLAS",
      created_by: "eyal",
      updated_by: "azran",
      is_deleted: false,
      is_classified: false,
      sec_groups: [],
    },
    {
      id: uuid2,
      name: "second item",
      reality_id: 0,
      classification: "INTEL",
      created_by: "eyal",
      updated_by: "azran",
      is_deleted: false,
      is_classified: false,
      sec_groups: ["sec1", "sec2"],
    },
  ]);

  await knex("software").insert([
    {
      item_id: uuid1,
      is_open_source: false,
    },
    {
      item_id: uuid2,
      is_open_source: true,
    },
  ]);

  await knex("office_equipment").insert([
    {
      item_id: uuid1,
      is_fragile: false,
    },
    {
      item_id: uuid2,
      is_fragile: true,
    },
  ]);

  await knex("office_forniture").insert([
    {
      item_id: uuid1,
      is_wood: false,
    },
    {
      item_id: uuid2,
      is_wood: true,
    },
  ]);

  await knex("storage_locations").insert([
    {
      id: uuid1,
      name: "SOUTH",
      reality_id: 1,
      classification: "UNCLAS",
      created_by: "eyal",
      updated_by: "azran",
      is_deleted: false,
      is_classified: false,
      sec_groups: [],
    },
    {
      id: uuid2,
      name: "NORTH",
      reality_id: 1,
      classification: "UNCLAS",
      created_by: "eyal",
      updated_by: "azran",
      is_deleted: false,
      is_classified: false,
      sec_groups: [],
    },
  ]);

  await knex("containers").insert([
    {
      id: uuid1,
      storage_locations_id: uuid1,
      reality_id: 1,
      classification: "UNCLAS",
      created_by: "eyal",
      updated_by: "azran",
      is_deleted: false,
      is_classified: false,
      sec_groups: [],
    },
    {
      id: uuid2,
      storage_locations_id: uuid2,
      reality_id: 1,
      classification: "UNCLAS",
      created_by: "eyal",
      updated_by: "azran",
      is_deleted: false,
      is_classified: false,
      sec_groups: [],
    },
  ]);

  await knex("container_items").insert([
    {
      item_id: uuid1,
      container_id: uuid1,
    },
    {
      item_id: uuid2,
      container_id: uuid2,
    },
  ]);
}
