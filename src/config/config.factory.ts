export interface LoggerConfig {
  level: string;
}

export interface Configuration {
  logger: LoggerConfig;
}

export function configFactory(): Configuration {
  return {
    logger: {
      level: process.env.LOGGER_LEVEL || "debug",
    },
  };
}
