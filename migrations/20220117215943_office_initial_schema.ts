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
    .createTable("storage_locations_enum", (table) => {
      table.string("type").primary();
    })
    .createTable("items", (table) => {
      baseEntity(table, knex);
      table.string("name").notNullable();
    })
    .createTable("office_qeuipment", (table) => {
      table.uuid("item_id").references("items.id").notNullable();
      table.boolean("is_fragile");
    })
    .createTable("software", (table) => {
      table.uuid("item_id").references("items.id").notNullable();
      table.boolean("is_open_source");
    })
    .createTable("office_forniture", (table) => {
      table.uuid("item_id").references("items.id").notNullable();
      table.boolean("is_wood");
    })
    .createTable("storage_locations", (table) => {
      baseEntity(table, knex);
      table
        .string("name")
        .references("storage_locations_enum.type")
        .notNullable();
    })
    .createTable("containers", (table) => {
      baseEntity(table, knex);
      table
        .uuid("storage_locations_id")
        .references("storage_locations.id")
        .notNullable();
    })
    .createTable("container_items", (table) => {
      table.uuid("item_id").references("items.id").notNullable();
      table.uuid("container_id").references("containers.id").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists("container_items")
    .dropTableIfExists("containers")
    .dropTableIfExists("storage_locations")
    .dropTableIfExists("storage_locations_enum")
    .dropTableIfExists("office_qeuipment")
    .dropTableIfExists("software")
    .dropTableIfExists("office_forniture")
    .dropTableIfExists("items")
    .dropTableIfExists("classification_enum");
}

// select 'drop table "' || tablename || '" cascade;' from pg_tables where schemaname = 'public';
// drop table "classification_enum" cascade;
// drop table "storage_locations" cascade;
// drop table "items" cascade;
// drop table "storage_locations_enum" cascade;
// drop table "containers" cascade;
// drop table "office_qeuipment" cascade;
// drop table "software" cascade;
// drop table "office_forniture" cascade;
// drop table "container_items" cascade;
// drop table "knex_migrations" cascade;
// drop table "knex_migrations_lock" cascade;
// drop table "owners" cascade;
// drop table "cats" cascade;
// drop table "cat_types" cascade;
