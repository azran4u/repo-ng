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

export interface Configuration {
  server: ServerConfig;
  logger: LoggerConfig;
}

export function configFactory(): Configuration {
  return {
    server: {
      port: +process.env.SERVER_PORT || 3500,
    },
    logger: {
      level: process.env.LOGGER_LEVEL || "info",
      logging: {
        logGraphqlEntitiesRequests: true,
        logGraphqlIntrospectionRequests: false,
        logNonGraphqlRequests: false,
      },
    },
  };
}
