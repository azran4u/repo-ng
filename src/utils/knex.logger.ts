import { Knex } from "knex";
import { Logger } from "winston";

export function knexLogger(
  knex: Knex,
  logger: Logger,
  logEverySql: boolean = false,
  logBindings: boolean = false
) {
  knex.on("query", function (queryData) {
    if (logEverySql) {
      if (logBindings) {
        logger.debug(
          `${queryData?.sql} ${JSON.stringify(queryData?.bindings)}`
        );
      } else {
        logger.info(queryData?.sql);
      }
    }
  });
}
