import { Knex } from 'knex';

function baseEntityColumns(table: Knex.CreateTableBuilder, knex: Knex): void {
  // common fields for every entity
  table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
  table.integer('reality_id').notNullable();
  table.integer('data_version').notNullable();
  table.timestamps(true, true); // adds created_at and updated_at
  table.string('created_by').defaultTo('unknown');
  table.string('updated_by').defaultTo('unknown');
  table.boolean('is_deleted').notNullable().defaultTo(false);
  table.boolean('is_classified').notNullable().defaultTo(false);
  table.specificType('sec_groups', 'text[]').defaultTo('{}');
  table.string('classification').references('classification.type');
  // indexes
  table.index('reality_id', undefined, 'btree');
  table.index('data_version', undefined, 'btree');
  table.index('classification', undefined, 'btree');
  table.index('is_deleted', undefined, 'btree');
}

function distributionListsColumns(table: Knex.CreateTableBuilder): void {
  table.specificType('distribution_lists', 'text[]').defaultTo('{}');
}

function remarkColumn(table: Knex.CreateTableBuilder): void {
  table.string('remark');
}

async function createExtentionPgCrypto(knex: Knex) {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
}

export async function up(knex: Knex): Promise<void> {
  await createExtentionPgCrypto(knex);
  return (
    knex.schema
      // enum tables
      .createTable('classification', (table) => {
        table.string('type').primary();
      })
      .createTable('coordination_status', (table) => {
        table.string('type').primary();
      })
      .createTable('day_night', (table) => {
        table.string('type').primary();
      })
      .createTable('required_achieve', (table) => {
        table.string('type').primary();
      })
      .createTable('system', (table) => {
        table.string('type').primary();
      })
      .createTable('publication_status', (table) => {
        table.string('type').primary();
      })
      .createTable('complexity_reason', (table) => {
        table.string('type').primary();
      })
      .createTable('complexity', (table) => {
        table.string('type').primary();
      })
      .createTable('approval_status', (table) => {
        table.string('type').primary();
      })
      // entity tables
      .createTable('tar', (table) => {
        baseEntityColumns(table, knex);
        table.string('code').notNullable();
        table.string('complexity').references('complexity.type');
        table.string('complexity_reason').references('complexity_reason.type');
      })
      .createTable('objectives', (table) => {
        baseEntityColumns(table, knex);
        table.integer('creating_system');
        table.string('technical_id');
      })
      .createTable('what_to_att', (table) => {
        baseEntityColumns(table, knex);
        table.string('required_achieve').references('required_achieve.type');
      })
      .createTable('approvers', (table) => {
        baseEntityColumns(table, knex);
        table.string('role');
        table.string('upn');
        table.string('name');
      })
      .createTable('operational_approvals', (table) => {
        baseEntityColumns(table, knex);
        remarkColumn(table);
        table.string('type_id');
        table.uuid('approver').references('approvers.id');
        table.dateTime('approval_time');
        table.string('status').references('approval_status.type').notNullable();
      })
      .createTable('intel_approvals', (table) => {
        baseEntityColumns(table, knex);
        remarkColumn(table);
        table.string('type_id');
        table.uuid('approver').references('approvers.id');
        table.dateTime('approval_time');
        table.string('status').references('approval_status.type').notNullable();
        table.boolean('is_nzp_checked');
        table.boolean('is_safety_checked');
        table.boolean('is_nz_checked');
        table.boolean('is_dm_checked');
      })
      .createTable('ad', (table) => {
        baseEntityColumns(table, knex);
        distributionListsColumns(table);
        remarkColumn(table);
        table.uuid('tar').references('tar.id').notNullable();
        table.string('owing_system_id').references('system.type').notNullable();
        table.uuid('what_to_att_id').references('what_to_att.id');
        table.uuid('objective_id').references('objectives.id');
        table.integer('objective_priority');
        table.string('requiring_role');
      })
      .createTable('approvals', (table) => {
        baseEntityColumns(table, knex);
        table
          .uuid('operational_approvals_id')
          .references('operational_approvals.id');
        table.uuid('intel_approvals_id').references('intel_approvals.id');
        table.uuid('ad_id').references('ad.id');
      })
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('approvals')
    .dropTableIfExists('ad')
    .dropTableIfExists('intel_approvals')
    .dropTableIfExists('operational_approvals')
    .dropTableIfExists('approvers')
    .dropTableIfExists('what_to_att')
    .dropTableIfExists('objectives')
    .dropTableIfExists('tar')
    .dropTableIfExists('approval_status')
    .dropTableIfExists('complexity')
    .dropTableIfExists('complexity_reason')
    .dropTableIfExists('publication_status')
    .dropTableIfExists('system')
    .dropTableIfExists('required_achieve')
    .dropTableIfExists('day_night')
    .dropTableIfExists('coordination_status')
    .dropTableIfExists('classification');
}
