import { Knex } from "knex";
import _ from "lodash";

export async function knexBatchInsertOrUpdate<T>(
  knex: Knex,
  table: string,
  column: string,
  collection: Record<string, any>[],
  operation: "insert" | "update"
): Promise<T[]> {
  const trx = await knex.transaction();
  try {
    const res = await Promise.all(
      collection.map((tuple) => {
        const value = tuple[column];
        delete tuple[column];
        const query = knex(table)
          .where(column, value)
          .returning("*")
          .transacting(trx);
        if (operation === "insert") {
          query.insert(tuple);
        }
        if (operation === "update") {
          query.update(tuple);
        }
        return query;
      })
    );
    await trx.commit();
    return _.flatten(res);
  } catch (error) {
    await trx.rollback();
    return [];
  }
}
