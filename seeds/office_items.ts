import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("items").del();

  await knex("items").insert([
    {
      name: "first item",
      reality_id: 1,
      classification: "NORTH",
      created_by: "eyal",
      updated_by: "azran",
      is_deleted: false,
      is_classified: false,
      sec_groups: [],
    },
    {
      name: "second item",
      reality_id: 0,
      classification: "SOUTH",
      created_by: "eyal",
      updated_by: "azran",
      is_deleted: false,
      is_classified: false,
      sec_groups: ["sec1", "sec2"],
    },
  ]);
}
