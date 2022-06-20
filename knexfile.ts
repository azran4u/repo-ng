// Update with your config settings.
import * as Knex from 'knex';
declare type KnexConfig = Knex.Knex.Config;

const knexfile: Record<string, KnexConfig> = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'postgres',
      host: '172.29.0.2',
      user: 'postgres',
      password: 'postgrespassword',
    },
    useNullAsDefault: true,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      extension: 'ts',
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};

module.exports = knexfile;
