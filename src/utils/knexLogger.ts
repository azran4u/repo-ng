import { Knex } from "knex";
import { Logger } from "winston";

export function knexLogger(knex: Knex, logger: Logger) {
  knex.on("query", function (queryData) {
    if (logger.level === "debug")
      logger.debug(`${queryData?.sql} ${JSON.stringify(queryData?.bindings)}`);
    else {
      logger.info(queryData?.sql);
    }
  });
}
