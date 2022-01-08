import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("cats", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.integer("age").unsigned();
      table
        .integer("ownerId")
        .unsigned()
        .references("id")
        .inTable("cats")
        .onDelete("SET NULL")
        .index();
    })
    .createTable("owners", (table) => {
      table.increments("id").primary();
      table.string("name");
      table.integer("age").unsigned();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("cats").dropTableIfExists("owners");
}
