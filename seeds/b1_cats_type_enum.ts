import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("cat_types").del();

  // Inserts seed entries
  await knex("cat_types").insert([
    { type: "TYPE1" },
    { type: "TYPE2" },
    { type: "TYPE3" },
  ]);
}
