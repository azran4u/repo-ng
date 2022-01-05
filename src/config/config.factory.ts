export interface ServerConfig {
  port: number;
}
export interface LoggerConfig {
  level: string;
}

export interface Configuration {
  server: ServerConfig;
  logger: LoggerConfig;
}

export function configFactory(): Configuration {
  return {
    server: {
      port: 3500,
    },
    logger: {
      level: process.env.LOGGER_LEVEL || "info",
    },
  };
}
