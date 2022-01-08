import * as knexfile from "../../knexfile";

export function getKnexConfig(configName?: string) {
  const name = configName ?? process.env.NODE_ENV ?? "development";
  return knexfile[name];
}
