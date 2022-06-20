import { Knex } from 'knex';

// .createTable('', (table) => {
//         table.string('type').primary();
//       })
//       .createTable('', (table) => {
//         table.string('type').primary();
//       })
//       .createTable('day_night', (table) => {
//         table.string('type').primary();
//       })
//       .createTable('required_achieve', (table) => {
//         table.string('type').primary();
//       })
//       .createTable('system', (table) => {
//         table.string('type').primary();
//       })
//       .createTable('publication_status', (table) => {
//         table.string('type').primary();
//       })
//       .createTable('complexity_reason', (table) => {
//         table.string('type').primary();
//       })
//       .createTable('complexity', (table) => {
//         table.string('type').primary();
//       })

async function fillEnumTable(knex: Knex, name: string, values: string[]) {
  await knex(name)
    .insert(
      values.map((val) => {
        return { type: val };
      })
    )
    .onConflict('type')
    .ignore();
}

export async function seed(knex: Knex): Promise<void> {
  const enums: Record<string, string[]> = {};
  enums['classification'] = [
    'UNCLAS',
    'SENSI',
    'CONFID',
    'SEC',
    'TSEC',
    'INTEL',
  ];
  enums['coordination_status'] = [
    'NOT_REQUIRED',
    'WAITING',
    'NO_RESPONSE',
    'APPROVED',
    'REJECTED',
    'STALE',
  ];
  enums['day_night'] = ['DAY', 'NIGHT'];
  enums['required_achieve'] = ['REQUIRED1', 'REQUIRED2'];
  enums['system'] = ['GLX', 'GAL'];
  enums['publication_status'] = ['DRAFT', 'PUBLISH', 'ACCEPTED'];
  enums['complexity_reason'] = ['REASON1', 'REASON2', 'REASON3'];
  enums['complexity'] = ['SIMPLE', 'COMPLEX'];
  enums['approval_status'] = ['APPROVED', 'PENDING', 'REJECTED'];
  await Promise.all(
    Object.keys(enums).map((key) => fillEnumTable(knex, key, enums[key]))
  );
}
