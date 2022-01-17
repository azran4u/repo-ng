import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("cat_types", (table) => {
      table.string("type").primary();
    })
    .alterTable("cats", (table) => {
      table.string("type").references("cat_types.type");
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("cats");
  await knex.schema.dropTableIfExists("cat_types");
  await knex.schema.dropTableIfExists("owners");
  knex.schema.table("groups", function (t) {
    t.dropColumn("type");
  });
}
