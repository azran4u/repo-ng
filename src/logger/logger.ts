import { format, Logger, LoggerOptions, transports } from "winston";
const { printf, combine, timestamp, colorize } = format;

const consoleFormat = printf(({ level, message, timestamp, service }) => {
  return `${timestamp} [${service}] ${level}: ${message}`;
});

export function loggerOptionsFactory(level: string) {
  const options: LoggerOptions = {
    defaultMeta: { service: "app" } as LoggerMetadata,
    transports: [
      new transports.Console({
        format: combine(timestamp(), colorize(), consoleFormat),
        level,
      }),
    ],
  };
  return options;
}

export interface LoggerMetadata {
  service: string;
}

export function childLogger(logger: Logger, metadata: LoggerMetadata) {
  const child = logger.child({});
  child.defaultMeta = { ...logger.defaultMeta, ...metadata };
  return child;
}
