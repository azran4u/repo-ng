import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("owners").del();

  // Inserts seed entries
  await knex("owners").insert([
    { id: 1, name: "owner1", age: 1 },
    { id: 2, name: "owner2", age: 2 },
    { id: 3, name: "owner3", age: 3 },
  ]);

  await knex("cats").del();

  // Inserts seed entries
  await knex("cats").insert([
    { id: 1, name: "cat1", age: 1, ownerId: 1 },
    { id: 2, name: "cat2", age: 2, ownerId: 2 },
    { id: 3, name: "cat3", age: 3, ownerId: 3 },
  ]);
}
