import { Knex } from "knex";

function baseEntity(table: Knex.CreateTableBuilder, knex: Knex): void {
  table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
  table.integer("reality_id").notNullable();
  table.string("classification").references("classification_enum.type");
  table.timestamps(true, true); // adds created_at and updated_at
  table.string("created_by");
  table.string("updated_by");
  table.boolean("is_deleted").notNullable().defaultTo(false);
  table.boolean("is_classified").notNullable().defaultTo(false);
  table.specificType("sec_groups", "text[]");
}

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("classification_enum", (table) => {
      table.string("type").primary();
    })
    .createTable("items", (table) => {
      baseEntity(table, knex);
      table.string("name").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists("items")
    .dropTableIfExists("classification_enum");
}
