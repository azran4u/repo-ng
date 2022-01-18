import { parseInt } from "lodash";

export interface ServerConfig {
  port: number;
}
export interface LoggerConfig {
  level: string;
  logging: {
    logGraphqlIntrospectionRequests?: boolean;
    logGraphqlEntitiesRequests?: boolean;
    logNonGraphqlRequests?: boolean;
  };
}

export interface KnexConfig {
  logging: {
    everySql: boolean;
    bindings: boolean;
  };
}

export interface Configuration {
  server: ServerConfig;
  logger: LoggerConfig;
  kenx: KnexConfig;
}

export function configFactory(): { config: Configuration } {
  return {
    config: {
      server: {
        port: envToNumberOrDefault("SERVER_PORT", 3500),
      },
      logger: {
        level: envToStringOrDefault("LOGGER_LEVEL", "debug"),
        logging: {
          logGraphqlEntitiesRequests: true,
          logGraphqlIntrospectionRequests: false,
          logNonGraphqlRequests: false,
        },
      },
      kenx: {
        logging: {
          everySql: envToBooleanWIthDefault("KNEX_LOGGING_EVERY_SQL", true),
          bindings: envToBooleanWIthDefault("KNEX_LOGGING_BINDING", true),
        },
      },
    },
  };
}

function envToNumberOrDefault(env: string, defaultValue: number): number {
  const value = process.env[env];
  if (!value) return defaultValue;
  const valueNumber = parseInt(value);
  return valueNumber;
}

function envToStringOrDefault(env: string, defaultValue: string): string {
  const value = process.env[env];
  if (!value) return defaultValue;
  return value;
}

function envToBooleanWIthDefault(env: string, defaultValue: boolean): boolean {
  const value = process.env[env];
  if (!value) return defaultValue;
  return value === "true" ? true : false;
}
