import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response, NextFunction } from "express";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Configuration, LoggerConfig } from "../config/config.factory";
import { getDurationInMilliseconds } from "./getDurationInMilliseconds";
import * as _ from "lodash";
@Injectable()
export class RequestDurationMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private configService: ConfigService
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime();
    const logger = this.logger;
    const loggerConfig = this.configService.get<Configuration>("config").logger;

    function logDuration(): void {
      const durationInMilliseconds = getDurationInMilliseconds(start);
      let operation: string;

      if (!_.isNil(req?.graphql?.subOperation)) {
        // graphql request
        if (req?.graphql?.subOperation === "__schema") {
          if (loggerConfig.logging.logGraphqlIntrospectionRequests) {
            operation = "introspection";
          }
        } else {
          if (loggerConfig.logging.logGraphqlEntitiesRequests) {
            operation = req?.graphql?.subOperation;
          }
        }
      } else {
        if (loggerConfig.logging.logNonGraphqlRequests) {
          operation = `${req.url} ${req.method}`;
        }
      }
      if (operation) {
        logger.info(
          `request for ${operation} took ${durationInMilliseconds}[ms]`
        );
      }
    }
    res.on("finish", () => {
      logDuration();
    });
    next();
  }
}
