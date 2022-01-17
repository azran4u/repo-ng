import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Inserts seed entries
  await knex("classification_enum")
    .insert([
      { type: "UNCLAS" },
      { type: "SENSI" },
      { type: "CONFID" },
      { type: "SEC" },
      { type: "TSEC" },
      { type: "INTEL" },
    ])
    .onConflict("type")
    .ignore();
}
