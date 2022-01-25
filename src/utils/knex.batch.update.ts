import { Knex } from "knex";

export async function knexBatchUpdate<T = any>(
  knex: Knex,
  table: string,
  column: string,
  collection: Record<string, T>[]
) {
  const trx = await knex.transaction();
  try {
    await Promise.all(
      collection.map((tuple) => {
        const value = tuple[column];
        delete tuple[column];
        return knex(table).where(column, value).update(tuple).transacting(trx);
      })
    );
    const res = await trx.commit().returning("*");
    debugger;
    return res;
  } catch (error) {
    await trx.rollback();
  }
}
