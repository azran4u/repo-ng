import { ConfigFactory } from '@nestjs/config';
import { parseInt } from 'lodash';
import { envToBooleanWIthDefault } from '../utils/string.to.boolean.with.default';

export const configFactory: ConfigFactory<{ config: Configuration }> = () => {
  return {
    config: {
      server: {
        port: envToNumberOrDefault('SERVER_PORT', 3500),
      },
      logger: {
        level: envToStringOrDefault('LOGGER_LEVEL', 'debug'),
        logging: {
          logGraphqlEntitiesRequests: true,
          logGraphqlIntrospectionRequests: false,
          logNonGraphqlRequests: false,
        },
      },
      kenx: {
        logging: {
          everySql: envToBooleanWIthDefault('KNEX_LOGGING_EVERY_SQL', true),
          bindings: envToBooleanWIthDefault('KNEX_LOGGING_BINDING', true),
        },
      },
      repo: {
        deletions: {
          logicalDelete: envToBooleanWIthDefault(
            'REPO_DELETIONS_LOGICAL_DELETE',
            true
          ),
          allowPartialDelete: envToBooleanWIthDefault(
            'REPO_DELETIONS_ALLOW_PARTIAL_DELETE',
            true
          ),
        },
      },
      pagination: {
        pageSize: {
          max: envToNumberOrDefault('PAGINATION_PAGE_SIZE_MAX', 100),
          min: envToNumberOrDefault('PAGINATION_PAGE_SIZE_MIN', 2),
        },
      },
    },
  };
};

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

export interface RepoConfig {
  deletions: {
    logicalDelete: boolean;
    allowPartialDelete: boolean;
  };
}

export interface PaginationConfig {
  pageSize: {
    min: number;
    max: number;
  };
}

export interface Configuration {
  server: ServerConfig;
  logger: LoggerConfig;
  kenx: KnexConfig;
  repo: RepoConfig;
  pagination: PaginationConfig;
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
