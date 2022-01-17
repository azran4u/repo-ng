import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Inserts seed entries
  await knex("classification_enum")
    .insert([{ type: "NORTH" }, { type: "CENTER" }, { type: "SOUTH" }])
    .onConflict("type")
    .ignore();
}
