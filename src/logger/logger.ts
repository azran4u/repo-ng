import { format, Logger, LoggerOptions } from "winston";
const { printf } = format;
import { Logger as AzureFunctionLogger } from "@azure/functions";
import Transport from "winston-transport";

const myFormat = printf(({ level, message, timestamp, service }) => {
  return `${timestamp} [${service}] ${level}: ${message}`;
});

export function loggerOptionsFactory(
  level: string,
  logger: AzureFunctionLogger
) {
  const options: LoggerOptions = {
    level: level ?? "info",
    defaultMeta: { service: "app" } as LoggerMetadata,
    transports: [
      // new transports.Console({
      //   format: combine(timestamp(), myFormat),
      // }),
      new AzureFunctionTransport(logger),
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

class AzureFunctionTransport extends Transport {
  constructor(private logger: AzureFunctionLogger) {
    super();
  }
  log(info: { message: string; level: string; service: string }, callback) {
    if (info.level === "info") {
      this.logger.info(info.message);
    } else if (info.level === "error") {
      this.logger.error(info.message);
    } else if (info.level === "debug") {
      this.logger.verbose(info.message);
    } else {
      this.logger.info(info.message);
    }
    callback();
  }
}
